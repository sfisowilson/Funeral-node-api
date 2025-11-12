import nodemailer from 'nodemailer';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import TenantSetting from '../models/tenantSetting';

interface EmailSettings {
  smtpServer?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  enableSsl?: boolean;
  smtpFromEmail?: string;
  smtpFromName?: string;
}

/**
 * Email Service - Handles sending emails using tenant-specific SMTP settings
 * Migrated from C# EmailService.cs with exact same functionality
 */
export class EmailService {
  private logger = {
    info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
    error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
    warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  };

  /**
   * Validate email format (same logic as C# MailAddress validation)
   * @param email - Email address to validate
   * @returns true if valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return false;
    }

    try {
      // RFC 5322 simplified validation - same as C# MailAddress
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    } catch {
      return false;
    }
  }

  /**
   * Strip HTML tags from string for plain text fallback
   * @param html - HTML string
   * @returns Plain text without HTML tags
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  }

  /**
   * Send email using tenant's SMTP configuration
   * Core method - matches C# SendEmailAsync exactly
   *
   * @param tenantId - Tenant ID for retrieving SMTP settings
   * @param email - Recipient email address
   * @param subject - Email subject
   * @param message - Email body (HTML supported)
   */
  async sendEmailAsync(
    tenantId: string,
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    try {
      // Get tenant settings
      const tenantSettings = await TenantSetting.findOne({
        where: { tenantId },
      });

      if (!tenantSettings || !tenantSettings.settings) {
        this.logger.warn(
          `Email settings not found for tenant ${tenantId}. Cannot send email to ${email}.`
        );
        return;
      }

      // Parse settings JSON
      let settings: EmailSettings;
      try {
        settings =
          typeof tenantSettings.settings === 'string'
            ? JSON.parse(tenantSettings.settings)
            : tenantSettings.settings;
      } catch (parseError) {
        this.logger.error(
          `Failed to parse email settings for tenant ${tenantId}`,
          parseError
        );
        return;
      }

      const {
        smtpServer,
        smtpPort = 587,
        smtpUsername,
        smtpPassword,
        enableSsl = true,
        smtpFromEmail,
        smtpFromName,
      } = settings;

      // Validate required SMTP settings
      if (!smtpServer || !smtpPort || !smtpUsername || !smtpPassword) {
        this.logger.warn(
          `Incomplete SMTP settings for tenant ${tenantId}. Cannot send email to ${email}.`
        );
        return;
      }

      // Determine from email and name (C# logic)
      const fromEmail = smtpFromEmail || smtpUsername;
      const fromName =
        smtpFromName ||
        (tenantSettings as any).tenantName ||
        'Funeral System';

      // Validate from email format (C# logic)
      if (!this.isValidEmail(fromEmail)) {
        this.logger.error(
          `Invalid from email address configured for tenant ${tenantId}: ${fromEmail}`
        );
        return;
      }

      // Create transporter (C# SmtpClient equivalent)
      const transporter = nodemailer.createTransport({
        host: smtpServer,
        port: smtpPort,
        secure: enableSsl, // Use TLS if enableSsl is true
        auth: {
          user: smtpUsername,
          pass: smtpPassword,
        },
      });

      // Send email (C# MailMessage equivalent)
      const info = await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: subject,
        html: message, // Supports HTML
        text: this.stripHtml(message), // Fallback plain text
      });

      this.logger.info(
        `Email sent successfully to ${email} with subject "${subject}". Message ID: ${info.messageId}`
      );
    } catch (error) {
      this.logger.error(
        `Error sending email to ${email} with subject "${subject}".`,
        error
      );
      throw error;
    }
  }

  /**
   * Send password reset email with HTML template
   */
  async sendPasswordResetEmailAsync(
    tenantId: string,
    userEmail: string,
    resetToken: string,
    tenantName: string = 'Funeral System'
  ): Promise<void> {
    const resetLink = `${
      process.env.FRONTEND_URL || 'http://localhost:4200'
    }/reset-password?token=${resetToken}`;

    const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #667eea;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested a password reset for your account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">
            Or copy and paste this link in your browser:<br/>
            <code>${resetLink}</code>
          </p>
          <p style="font-size: 12px; color: #999;">
            This link will expire in 24 hours. If you did not request a password reset, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <footer style="text-align: center; font-size: 12px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} ${tenantName}. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;

    await this.sendEmailAsync(
      tenantId,
      userEmail,
      `${tenantName} - Password Reset Request`,
      htmlBody
    );
  }

  /**
   * Send account creation/welcome email with temporary password
   */
  async sendWelcomeEmailAsync(
    tenantId: string,
    userEmail: string,
    userName: string,
    temporaryPassword: string,
    tenantName: string = 'Funeral System'
  ): Promise<void> {
    const loginUrl = `${
      process.env.FRONTEND_URL || 'http://localhost:4200'
    }/login`;

    const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #667eea;">Welcome to ${tenantName}!</h2>
          <p>Hello ${userName},</p>
          <p>Your account has been created successfully. Please use the credentials below to log in for the first time:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Temporary Password:</strong> <code>${temporaryPassword}</code></p>
          </div>
          <p style="color: #e74c3c;"><strong>Important:</strong> Please change your password immediately upon first login.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Log In Now
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">
            If you did not create this account, please contact our support team immediately.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <footer style="text-align: center; font-size: 12px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} ${tenantName}. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;

    await this.sendEmailAsync(
      tenantId,
      userEmail,
      `${tenantName} - Welcome! Account Created`,
      htmlBody
    );
  }

  /**
   * Send claim notification email
   */
  async sendClaimNotificationEmailAsync(
    tenantId: string,
    recipientEmail: string,
    claimNumber: string,
    claimAmount: number,
    claimStatus: string,
    tenantName: string = 'Funeral System'
  ): Promise<void> {
    const portalUrl = `${
      process.env.FRONTEND_URL || 'http://localhost:4200'
    }/claims/${claimNumber}`;

    const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #667eea;">Claim Status Update</h2>
          <p>Hello,</p>
          <p>We have an update regarding your claim:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Claim Number:</strong> ${claimNumber}</p>
            <p><strong>Claim Amount:</strong> R${claimAmount.toLocaleString('en-ZA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</p>
            <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">${claimStatus}</span></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${portalUrl}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Claim Details
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">
            For more information, please log into your account and navigate to your claims section.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <footer style="text-align: center; font-size: 12px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} ${tenantName}. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;

    await this.sendEmailAsync(
      tenantId,
      recipientEmail,
      `${tenantName} - Claim Status Update: ${claimNumber}`,
      htmlBody
    );
  }

  /**
   * Send document request email with required documents list
   */
  async sendDocumentRequestEmailAsync(
    tenantId: string,
    recipientEmail: string,
    requiredDocuments: string[],
    tenantName: string = 'Funeral System'
  ): Promise<void> {
    const portalUrl = `${
      process.env.FRONTEND_URL || 'http://localhost:4200'
    }/documents`;

    const documentsList = requiredDocuments
      .map((doc) => `<li>${doc}</li>`)
      .join('');

    const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #667eea;">Document Request</h2>
          <p>Hello,</p>
          <p>We require the following documents to process your claim:</p>
          <ul style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            ${documentsList}
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${portalUrl}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Upload Documents
            </a>
          </div>
          <p style="color: #e74c3c;"><strong>Important:</strong> Please upload the required documents within 14 days to avoid delays in processing your claim.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <footer style="text-align: center; font-size: 12px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} ${tenantName}. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;

    await this.sendEmailAsync(
      tenantId,
      recipientEmail,
      `${tenantName} - Document Request for Your Claim`,
      htmlBody
    );
  }

  /**
   * Send OTP/verification code email
   */
  async sendVerificationCodeEmailAsync(
    tenantId: string,
    recipientEmail: string,
    verificationCode: string,
    expirationMinutes: number = 15,
    tenantName: string = 'Funeral System'
  ): Promise<void> {
    const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #667eea;">Verification Code</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #667eea; font-family: monospace;">
              ${verificationCode}
            </p>
          </div>
          <p style="font-size: 14px; color: #666;">
            This code will expire in ${expirationMinutes} minutes.
          </p>
          <p style="color: #e74c3c;"><strong>Important:</strong> Do not share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <footer style="text-align: center; font-size: 12px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} ${tenantName}. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
    `;

    await this.sendEmailAsync(
      tenantId,
      recipientEmail,
      `${tenantName} - Verification Code`,
      htmlBody
    );
  }
}

// Export singleton instance
export const emailService = new EmailService();
