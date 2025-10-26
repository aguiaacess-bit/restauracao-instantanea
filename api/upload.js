// api/upload.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { filename, email, data } = req.body || {};
  console.log('Recebido (frontend):', { filename, email: !!email });

  if (!filename || !email || !data) {
    return res.status(400).json({ error: 'Faltam filename, email ou data' });
  }

  // pega do env
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.error('Variáveis de ambiente EMAIL_USER/EMAIL_PASS não definidas');
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
      attachments: [{ filename, content: Buffer.from(data, 'base64') }]
    });

    console.log('Email enviado com sucesso:', info && info.messageId);
    return res.status(200).json({ message: 'Arquivo enviado por e-mail com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar e-mail (detalhe):', err);
    // devolve a mensagem do erro para facilitar debug (somente útil em dev)
    return res.status(500).json({ error: 'Erro ao enviar o e-mail.', detail: String(err) });
  }
}
