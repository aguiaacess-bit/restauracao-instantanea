import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Informe um email' });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
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
      subject: 'Teste de envio de e-mail',
      text: 'Este é um teste, ignore.',
      attachments: [
        { filename: 'teste.txt', content: 'Olá, isso é um arquivo de teste!' }
      ]
    });

    console.log('✅ Email de teste enviado:', info.messageId);
    return res.status(200).json({ message: 'Email de teste enviado com sucesso!' });
  } catch (err) {
    console.error('🔥 ERRO AO ENVIAR EMAIL:', err);
    return res.status(500).json({ error: 'Erro ao enviar email', detail: String(err) });
  }
}
