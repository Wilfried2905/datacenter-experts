import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - DATACENTER EXPERTS',
    html: `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, tempPassword: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Bienvenue sur DATACENTER EXPERTS',
    html: `
      <h1>Bienvenue sur DATACENTER EXPERTS</h1>
      <p>Votre compte a été créé avec succès.</p>
      <p>Voici vos identifiants de connexion :</p>
      <ul>
        <li>Email : ${email}</li>
        <li>Mot de passe temporaire : ${tempPassword}</li>
      </ul>
      <p>Pour des raisons de sécurité, veuillez changer votre mot de passe lors de votre première connexion.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
