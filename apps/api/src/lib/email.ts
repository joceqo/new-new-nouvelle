import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email: string, code: string): Promise<void> {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // In development, log to console
    console.log('\n=================================');
    console.log('📧 OTP Code for:', email);
    console.log('🔑 Code:', code);
    console.log('=================================\n');
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: email,
      subject: 'Your Nouvelle verification code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Nouvelle</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Your verification code</h2>
              <p style="font-size: 16px; color: #666;">Enter this code to complete your sign in:</p>
              <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${code}</span>
              </div>
              <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
              <p style="font-size: 14px; color: #666;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
              <p>© ${new Date().getFullYear()} Nouvelle. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send verification email');
  }
}
