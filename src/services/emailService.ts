import { createTransport } from "nodemailer";

// Function to send an email to the employee with the temporary password
export async function notifyRegistrant(
  email: string,
  tempPassword: string,
): Promise<void> {
  // Setup the email transporter (using a test account for example)
  console.log("mailtrap", process.env.MAILTRAP_PWD);
  const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io", // Replace with your SMTP server host
    port: 2525, // Replace with the port number
    secure: false, // Set to true if using SSL/TLS
    auth: {
      user: "7dac6c2d438e3e",
      pass: process.env.MAILTRAP_PWD,
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "HR Team <hr@microcredit.com>", // Replace with your "From" email name and address
    to: email,
    subject: "Welcome to Micro Credit Investments", // Email subject
    html: `
      <p>Dear Employee,</p>
      <p>Your account has been created. Please find your temporary password below:</p>
      <p><strong>${tempPassword}</strong></p>
      <p>Please login and change your password after logging in.</p>
      <p>Best regards,</p>
      <p>Micro Credit Investments</p>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}
