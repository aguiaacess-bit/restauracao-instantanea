// api/upload.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { filename, email, data } = req.body;

    console.log('Recebido:', filename, email);

    // Configuração do Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aguiaacess@gmail.com',     // seu Gmail do site
        pass: 'zsnygcbksvtjfivq',        // senha de app gerada, sem espaços
      },
    });

    try {
      await transporter.sendMail({
        from: '"Restauração Instantânea" <aguiaacess@gmail.com>',
        to: email, // envia para o e-mail do usuário
        subject: 'Sua foto restaurada',
        text: 'Aqui está sua foto restaurada!',
        attachments: [
          {
            filename: filename,
            content: Buffer.from(data, 'base64'),
          },
        ],
      });

      return res.status(200).json({ message: 'Arquivo enviado por e-mail com sucesso!' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
    }
  }
  res.status(405).json({ error: 'Método não permitido' });
}
