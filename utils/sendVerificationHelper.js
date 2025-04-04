import transporter from "./nodemailerTransporter.js";

const sendVerificationEmailHelper = async (user, verificationLink) => {

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Verify your email",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #555;">
          Hello ${user.fullname},<br><br>
          Please click the button below to verify your email:
        </p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #252161; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p style="font-size: 14px; color: #777;">If you didn't request this, you can ignore this email.</p>
        <p style="font-size: 14px; color: #777;">Regards,<br>Future Insights</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};

export default sendVerificationEmailHelper;