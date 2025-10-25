export default function handler(req, res) {
  if (req.method === 'POST') {
    const { filename, email, data } = req.body;
    console.log('Recebido:', filename, email);
    // Aqui você pode salvar no banco, enviar e-mail ou processar a IA
    return res.status(200).json({ message: 'Arquivo recebido com sucesso!' });
  }
  res.status(405).json({ error: 'Método não permitido' });
}
