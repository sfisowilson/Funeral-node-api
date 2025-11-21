import * as nodemailer from 'nodemailer';
import tenantSettingService from './tenantSettingService';

export default {
  async sendEmail(tenantId: string, to: string, subject: string, html: string) {
    try {
      console.log(`Attempting to send email to ${to} for tenant ${tenantId}`);

      const tenantSettings = await tenantSettingService.getCurrentTenantSettings(tenantId);
      if (!tenantSettings || !tenantSettings.settings) {
        console.error(`Email settings not found for tenant ${tenantId}.`);
        // Decide if you want to throw an error or just log and exit
        return;
      }

      const settings = JSON.parse(tenantSettings.settings);
      // C# uses PascalCase, so we'll check for both just in case
      const smtpServer = settings.SmtpServer || settings.smtpServer;
      const smtpPort = settings.SmtpPort || settings.smtpPort;
      const smtpUsername = settings.SmtpUsername || settings.smtpUsername;
      const smtpPassword = settings.SmtpPassword || settings.smtpPassword;
      const enableSsl = settings.EnableSsl || settings.enableSsl;
      const fromEmail = settings.SmtpFromEmail || settings.smtpFromEmail || smtpUsername;
      const fromName = settings.SmtpFromName || settings.smtpFromName || tenantSettings.tenantName || 'System';


      if (!smtpServer || !smtpPort || !smtpUsername || !smtpPassword) {
        console.error(`Incomplete SMTP settings for tenant ${tenantId}.`);
        // Decide if you want to throw an error or just log and exit
        return;
      }

      const transporter = nodemailer.createTransport({
        host: smtpServer,
        port: smtpPort,
        secure: enableSsl, // true for 465, false for other ports
        auth: {
          user: smtpUsername,
          pass: smtpPassword,
        },
      });

      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: to,
        subject: subject,
        html: html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      // Re-throwing the error is important so the calling service can handle it
      throw error;
    }
  },
};