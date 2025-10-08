import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['SENDMAIL_HOST', 'MAILER_USER', 'MAILER_PASS', 'FRONTEND_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SENDMAIL_HOST,
  service: process.env.SENDMAIL_SERVICE || undefined,
  port: process.env.SENDMAIL_PORT ? parseInt(process.env.SENDMAIL_PORT, 10) : undefined,
  secure: process.env.SENDMAIL_SECURE === "true",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

export const sendmailer = async (
  email: string,
  token: string,
  userName: string
): Promise<void> => {
  const currentYear = new Date().getFullYear();
  
  // Encode parameters for URL safety
  const encodedToken = encodeURIComponent(token);
  const encodedEmail = encodeURIComponent(email);
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${encodedToken}&email=${encodedEmail}`;

  const mailOptions = {
    from: {
      name: "Raza Tech Solution",
      address: process.env.MAILER_USER as string,
    },
    to: email,
    subject: "Confirm Your Email Address",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Email Address</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap');
          
          body {
            font-family: 'Manrope', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #E8E4D9;
          }
          
          .container {
            max-width: 500px;
            margin: 20px auto;
            background: linear-gradient(140deg, #000000, #353535e1);
            border-radius: 50px;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .logo {
            width: 8rem;
            height: auto;
            margin: 20px auto;
            display: block;
          }
          
          .greeting {
            color: #E8E4D9;
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          
          .subtitle {
            color: #D3D3D3;
            font-size: 16px;
            margin-bottom: 30px;
            opacity: 0.9;
          }
          
          .verify-btn {
            display: inline-block;
            background: linear-gradient(180deg, #888888, #e4e4e4);
            color: #2d2d2d !important;
            border: none;
            padding: 15px 40px;
            border-radius: 5rem;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 
                        0 0 20px rgba(255, 255, 255, 0.5) inset;
            transition: all 0.3s ease;
          }
          
          .verify-btn:hover {
            background: linear-gradient(135deg, #D3D3D3, #B8B8B8);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          }
          
          .description {
            color: #E8E4D9;
            font-size: 14px;
            line-height: 1.6;
            opacity: 0.8;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(232, 228, 217, 0.2);
            color: #E8E4D9;
            font-size: 12px;
          }
          
          .warning {
            color: #ff6b6b;
            font-size: 12px;
            margin-top: 20px;
          }
          
          @media (max-width: 480px) {
            .container {
              padding: 30px 20px;
              margin: 10px;
            }
            
            .greeting {
              font-size: 20px;
            }
            
            .verify-btn {
              padding: 12px 30px;
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://res.cloudinary.com/dkbz23qyt/image/upload/v1759903048/Modern_n9nqzm.png" 
               class="logo" 
               alt="Raza Tech Solution Logo" />
          
          <h1 class="greeting">Hey ${userName}!</h1>
          <p class="subtitle">You need to confirm your email</p>
          
          <a href="${verificationUrl}" class="verify-btn">
            VERIFY EMAIL
          </a>
          
          <p class="description">
            Thank you for your interest in my <strong>Raza Tech Solution</strong>. I appreciate you exploring my selected works and the creative process behind them. If you have a project in mind or would like to connect, I welcome the opportunity to discuss how we might work together.
          </p>
          
          <p class="warning">
            If you didn't request this email, please ignore it. This verification link will expire in 24 hours.
          </p>
          
          <div class="footer">
            <p>© ${currentYear} <strong>Raza Tech Solution</strong>. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};