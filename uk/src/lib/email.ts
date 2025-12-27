import nodemailer from "nodemailer";

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // false for port 587, true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:", error.message);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
export async function sendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "🔐 Verify Your Email - Devbhoomi Darshan",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; margin-bottom: 8px; }
          .content { padding: 40px 30px; }
          .otp-box { background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px dashed #f59e0b; padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; }
          .otp-code { font-size: 42px; font-weight: 900; color: #ea580c; letter-spacing: 12px; font-family: monospace; margin: 15px 0; }
          .info-box { background: #f3f4f6; border-left: 4px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 6px; }
          .footer { background: #f9fafb; text-align: center; padding: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; }
          ul { padding-left: 20px; }
          li { margin: 8px 0; color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕉️ Devbhoomi Darshan</h1>
            <p>Email Verification</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937;">Hello ${name}! 👋</h2>
            <p style="color: #4b5563; margin: 15px 0;">
              Thank you for signing up with <strong>Devbhoomi Darshan</strong>. 
              Please verify your email using the OTP below:
            </p>
            <div class="otp-box">
              <p style="color: #78350f; font-size: 14px; font-weight: 600;">YOUR VERIFICATION CODE</p>
              <div class="otp-code">${otp}</div>
              <p style="color: #92400e; font-size: 13px; font-weight: 600;">⏰ Valid for 10 minutes</p>
            </div>
            <div class="info-box">
              <h3 style="margin-bottom: 12px; color: #1f2937;">⚠️ Important</h3>
              <ul>
                <li>Valid for <strong>10 minutes</strong> only</li>
                <li>Do not share with anyone</li>
                <li>Maximum <strong>5 attempts</strong></li>
                <li>Ignore if you didn't request this</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p><strong>© ${new Date().getFullYear()} Devbhoomi Darshan</strong></p>
            <p>This is an automated email. Do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hello ${name}!

Your verification code: ${otp}

Valid for 10 minutes.

© ${new Date().getFullYear()} Devbhoomi Darshan
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", email);
    console.log("📨 Message ID:", info.messageId);
    return true;
  } catch (error) {
    const err = error as Error;
    console.error("❌ Email sending failed");
    console.error("Error:", err.message);
    throw new Error("Failed to send OTP email");
  }
}
