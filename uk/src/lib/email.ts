// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: parseInt(process.env.EMAIL_PORT || "587"),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Generate 6-digit OTP
// export function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Send OTP Email
// export async function sendOTPEmail(email: string, otp: string, name: string) {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: "🔐 Verify Your Email - Devbhoomi Darshan",
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header {
//             background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
//             color: white;
//             padding: 30px;
//             text-align: center;
//             border-radius: 10px 10px 0 0;
//           }
//           .header h1 { margin: 0; font-size: 24px; }
//           .content {
//             background: #ffffff;
//             padding: 30px;
//             border: 1px solid #e5e7eb;
//             border-top: none;
//           }
//           .otp-box {
//             background: #fef3c7;
//             border: 2px dashed #f59e0b;
//             padding: 20px;
//             text-align: center;
//             margin: 20px 0;
//             border-radius: 8px;
//           }
//           .otp-code {
//             font-size: 32px;
//             font-weight: bold;
//             color: #ea580c;
//             letter-spacing: 8px;
//             font-family: monospace;
//           }
//           .footer {
//             text-align: center;
//             padding: 20px;
//             color: #6b7280;
//             font-size: 12px;
//           }
//           ul { padding-left: 20px; }
//           li { margin: 8px 0; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>🕉️ Devbhoomi Darshan</h1>
//             <p style="margin: 5px 0 0 0;">Email Verification</p>
//           </div>
//           <div class="content">
//             <h2 style="color: #1f2937; margin-top: 0;">Hello ${name}! 👋</h2>
//             <p>Thank you for signing up with Devbhoomi Darshan. To complete your registration,
//                please verify your email address using the OTP below:</p>

//             <div class="otp-box">
//               <p style="margin: 0; color: #78350f; font-size: 14px;">Your OTP Code</p>
//               <div class="otp-code">${otp}</div>
//               <p style="margin: 10px 0 0 0; color: #92400e; font-size: 12px;">
//                 ⏰ Valid for 10 minutes
//               </p>
//             </div>

//             <p><strong>Important:</strong></p>
//             <ul>
//               <li>This OTP is valid for <strong>10 minutes</strong> only</li>
//               <li>Do not share this code with anyone</li>
//               <li>If you didn't request this, please ignore this email</li>
//             </ul>

//             <p>Once verified, you'll have access to:</p>
//             <ul>
//               <li>✅ Explore sacred destinations</li>
//               <li>✅ Book spiritual journeys</li>
//               <li>✅ Save your favorite places</li>
//               <li>✅ Personalized recommendations</li>
//             </ul>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Devbhoomi Darshan. All rights reserved.</p>
//             <p>This is an automated email. Please do not reply.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("✅ OTP Email sent to:", email);
//     return true;
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw new Error("Failed to send OTP email");
//   }
// }

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to Console (for testing - no email)
export async function sendOTPEmail(email: string, otp: string, name: string) {
  try {
    // 👇 CONSOLE MEIN PRINT KARO (Testing ke liye)
    console.log("═══════════════════════════════════════════");
    console.log("📧 OTP EMAIL (Console Mode)");
    console.log("═══════════════════════════════════════════");
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Valid for: 10 minutes`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    console.log("═══════════════════════════════════════════\n");

    return true;
  } catch (error) {
    console.error("❌ OTP generation failed:", error);
    throw new Error("Failed to generate OTP");
  }
}
