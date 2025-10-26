// api/upload.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { filename, email, data } = req.body;

    console.log('Recebido:', filename, email);

    // Aqui você pode:
    // - Salvar a imagem no banco (MongoDB, Supabase, Firebase)
    // - Enviar para IA processar
    // - Enviar e-mail de confirmação

    return res.status(200).json({ message: 'Arquivo recebido com sucesso!' });
  }
  res.status(405).json({ error: 'Método não permitido' });
}
