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

  return res.status(200).json({ message: '✅ Dados recebidos com sucesso' });
}
