import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required but not found in environment variables. Please add your Resend API key to the .env file.');
    }
    
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    
    console.log('✅ EmailService initialized with Resend API');
  }

  public async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      console.log(`📧 Attempting to send welcome email to: ${to}`);
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: 'Welcome to ApniSec - Your Cybersecurity Platform',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to ApniSec</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ApniSec</h1>
                  <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Cybersecurity Solutions</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${name}! 🎉</h2>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for joining <strong>ApniSec</strong>, your trusted cybersecurity platform. 
                    We're excited to have you on board!
                  </p>
                  
                  <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0;">
                    <h3 style="color: #1d4ed8; margin: 0 0 15px 0; font-size: 18px;">What You Can Do:</h3>
                    <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li>Create and manage security issues</li>
                      <li>Track Cloud Security assessments</li>
                      <li>Monitor VAPT (Vulnerability Assessment and Penetration Testing) progress</li>
                      <li>Manage Reteam Assessments</li>
                      <li>Receive real-time notifications</li>
                    </ul>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Go to Dashboard
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    If you have any questions or need assistance, feel free to reach out to our support team.
                  </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    Best regards,<br>
                    <strong>The ApniSec Team</strong>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                    © ${new Date().getFullYear()} ApniSec. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Failed to send welcome email:', error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
      }

      console.log('✅ Welcome email sent successfully! Email ID:', data?.id);
    } catch (error: any) {
      console.error('❌ Email delivery error:', error);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }

  public async sendIssueCreatedEmail(to: string, issueTitle: string, issueType: string, issueDescription: string, issuePriority: string): Promise<void> {
    try {
      console.log(`📧 Attempting to send issue created email to: ${to}`);
      
      const priorityColors: Record<string, string> = {
        critical: '#dc2626',
        high: '#ea580c',
        medium: '#f59e0b',
        low: '#10b981'
      };
      
      const priorityColor = priorityColors[issuePriority.toLowerCase()] || '#6b7280';
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: `New Issue Created: ${issueTitle}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Issue Created</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ApniSec</h1>
                  <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Issue Notification</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Issue Created Successfully ✓</h2>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
                    Your new <strong>${issueType}</strong> issue has been created and is now being tracked in your dashboard.
                  </p>
                  
                  <!-- Issue Details Card -->
                  <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 20px 0;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                      ${issueTitle}
                    </h3>
                    
                    <div style="margin: 15px 0;">
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 10px 0; color: #6b7280; font-weight: bold; width: 120px;">Type:</td>
                          <td style="padding: 10px 0; color: #1f2937;">
                            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">
                              ${issueType}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Priority:</td>
                          <td style="padding: 10px 0; color: #1f2937;">
                            <span style="background-color: ${priorityColor}; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; text-transform: uppercase;">
                              ${issuePriority}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Description:</td>
                          <td style="padding: 10px 0; color: #1f2937; line-height: 1.6;">
                            ${issueDescription}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Status:</td>
                          <td style="padding: 10px 0; color: #1f2937;">
                            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">
                              OPEN
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Created:</td>
                          <td style="padding: 10px 0; color: #1f2937;">
                            ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  
                  <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 30px 0;">
                    <p style="color: #1e40af; margin: 0; font-size: 14px;">
                      💡 <strong>Next Steps:</strong> You can track the progress of this issue in your dashboard and update its status as needed.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      View in Dashboard
                    </a>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    Best regards,<br>
                    <strong>The ApniSec Team</strong>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                    © ${new Date().getFullYear()} ApniSec. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Failed to send issue created email:', error);
        throw new Error(`Failed to send issue created email: ${error.message}`);
      }

      console.log('✅ Issue created email sent successfully! Email ID:', data?.id);
    } catch (error: any) {
      console.error('❌ Email delivery error:', error);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }

  public async sendProfileUpdateEmail(to: string, name: string): Promise<void> {
    try {
      console.log(`📧 Attempting to send profile update email to: ${to}`);
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: 'Profile Updated Successfully - ApniSec',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Profile Updated</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ApniSec</h1>
                  <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Security Notification</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Profile Updated ✓</h2>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi <strong>${name}</strong>,
                  </p>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
                    Your profile has been updated successfully. This email confirms that changes were made to your account.
                  </p>
                  
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
                    <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ Security Notice:</strong><br>
                      If you didn't make this change, please contact our support team immediately to secure your account.
                    </p>
                  </div>
                  
                  <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                      <strong>Update Time:</strong> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">
                      <strong>Account:</strong> ${to}
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile" 
                       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      View Profile
                    </a>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    Best regards,<br>
                    <strong>The ApniSec Team</strong>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                    © ${new Date().getFullYear()} ApniSec. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `
      });

      if (error) {
        console.error('❌ Failed to send profile update email:', error);
        throw new Error(`Failed to send profile update email: ${error.message}`);
      }

      console.log('✅ Profile update email sent successfully! Email ID:', data?.id);
    } catch (error: any) {
      console.error('❌ Email delivery error:', error);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }
}