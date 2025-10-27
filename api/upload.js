import nodemailer from 'nodemailer';
import OpenAI from 'openai';

export default async function handler(req, res) {
  console.log("🔥 API /upload CHAMADA");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { filename, email, data } = req.body || {};
  console.log("📩 RECEBIDO:", {
    hasFilename: !!filename,
    hasEmail: !!email,
    dataLength: data ? data.length : 0
  });

  if (!filename || !email || !data) {
    return res.status(400).json({ error: 'Faltam filename, email ou data' });
  }

  // 1️⃣ Configurar OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  let restoredImage;
  try {
    // Exemplo de restauração simples usando a OpenAI
    const result = await openai.images.edit({
      model: 'gpt-image-1',
      image: Buffer.from(data, 'base64'),
      prompt: 'Restaurar a imagem, melhorar qualidade',
      size: '1024x1024'
    });
    restoredImage = result.data[0].b64_json;
  } catch (err) {
    console.error('🔥 ERRO AO PROCESSAR IMAGEM NA OPENAI:', err);
    return res.status(500).json({ error: 'Erro ao processar imagem', detail: String(err) });
  }

  // 2️⃣ Configurar Nodemailer
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error('❌ EMAIL_USER ou EMAIL_PASS não configurados');
    return res.status(500).json({ error: 'Servidor sem configuração de e-mail' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Restauração Instantânea" <${user}>`,
      to: email,
      subject: 'Sua foto restaurada',
      text: 'Aqui está sua foto restaurada!',
      attachments: [
        { filename, content: Buffer.from(restoredImage, 'base64') }
      ]
    });

    console.log('✅ Email enviado com sucesso:', info.messageId);
    return res.status(200).json({ message: 'Arquivo restaurado e enviado com sucesso!' });

  } catch (err) {
    console.error('🔥 ERRO AO ENVIAR EMAIL:', err);
    return res.status(500).json({ error: 'Erro ao enviar e-mail', detail: String(err) });
  }
}
