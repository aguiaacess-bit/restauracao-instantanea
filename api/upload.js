import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { filename, email, data } = req.body || {};
  console.log("📩 RECEBIDO:", { hasFilename: !!filename, hasEmail: !!email, dataLength: data?.length || 0 });

  if (!filename || !email || !data) {
    return res.status(400).json({ error: 'Faltam filename, email ou data' });
  }

  // Configura OpenAI
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const result = await openai.images.edit({
      model: 'gpt-image-1',
      image: Buffer.from(data, 'base64'),
      prompt: 'Restaurar a imagem, melhorar qualidade',
      size: '1024x1024'
    });

    const restoredImage = result.data[0].b64_json;
    console.log('✅ Imagem restaurada gerada com sucesso');

    return res.status(200).json({ message: 'Imagem restaurada com sucesso!', restoredImage });
  } catch (err) {
    console.error('🔥 ERRO AO GERAR IMAGEM:', err);
    return res.status(500).json({ error: 'Erro ao processar imagem', detail: String(err) });
  }
}
