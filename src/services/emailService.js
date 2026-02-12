const dateHelper = require('../utils/dateHelper');
const transporter = require('../config/email');
const config = require('../config/env');

/**
 * Generate email HTML template
 * @param {Object} client 
 * @param {string} secureLink 
 * @returns {string} HTML email content
 */
function generateEmailTemplate(client, secureLink) {
  const expiryDate = dateHelper.formatDate(client.expiryDate);
  const tokenExpiryDate = dateHelper.formatDate(client.tokenExpiry);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 30px;
          border: 1px solid #e0e0e0;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
          margin: -30px -30px 20px -30px;
        }
        .content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .highlight {
          background-color: #fff3cd;
          padding: 15px;
          border-left: 4px solid #ffc107;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Renewal Reminder</h1>
        </div>
        
        <div class="content">
          <p>Dear <strong>${client.clientName}</strong>,</p>
          
          <p>We hope you've been enjoying our services! This is a friendly reminder that your subscription is expiring soon.</p>
          
          <div class="highlight">
            <strong>Subscription Details:</strong><br>
            📅 Expiry Date: <strong>${expiryDate}</strong><br>
            ⏰ Days Remaining: <strong>5 days</strong>
          </div>
          
          <p>We would love to continue serving you! Please let us know if you'd like to renew your subscription by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${secureLink}" class="button">Respond to Renewal</a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            Or copy and paste this link into your browser:<br>
            <a href="${secureLink}">${secureLink}</a>
          </p>
          
          <p style="font-size: 12px; color: #999;">
            <strong>Note:</strong> This link is valid until ${tokenExpiryDate} and can only be used once.
          </p>
        </div>
        
        <div class="footer">
          <p>Best regards,<br><strong>${config.companyName}</strong></p>
          <p style="margin-top: 10px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send renewal reminder email
 * @param {Object} client 
 * @param {string} token 
 * @returns {Promise<Object>} Email send result
 */
async function sendReminderEmail(client, token) {
  const secureLink = `${config.baseUrl}/response/${token}`;

  const mailOptions = {
    from: `"${config.companyName}" <${config.email.from}>`,
    to: client.email,
    subject: `Your subscription expires in 5 days - Action Required`,
    html: generateEmailTemplate(client, secureLink),
    text: `
Dear ${client.clientName},

Your subscription is expiring soon:
- Expiry Date: ${client.expiryDate}
- Days Remaining: 5 days

Would you like to continue your subscription?

Click the link below to let us know:
${secureLink}

This link is valid until ${client.tokenExpiry}.

Best regards,
${config.companyName}
    `.trim()
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${client.email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${client.email}:`, error);
    throw error;
  }
}

module.exports = {
  sendReminderEmail,
  generateEmailTemplate,
};
