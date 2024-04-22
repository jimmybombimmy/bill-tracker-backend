import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
})


export const sendPasswordResetEmail = (resetToken: string, userEmail: string, resetUrl: string) => {
  //To do: configure href link for a tag
  const email = transporter.sendMail({
    from: "passwordreset@billstracker.com",
    to: 'jamespeters92@gmail.com',
    subject: "Bills Tracker - Password Reset",
    text: `You have requested to reset your password. Click here to reset your password`,
    html: `<p>You have requested to reset your password</p><p><a href=${resetUrl}/${resetToken}>Click here to reset your password</a></p>`
  })
}