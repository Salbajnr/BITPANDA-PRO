
import { sendEmail, getBaseUrl } from './email-service';

// Template for account security alerts
export async function sendSecurityAlertEmail(
  email: string, 
  alertType: 'login_new_device' | 'password_changed' | 'api_key_created' | 'suspicious_activity',
  details: any
): Promise<boolean> {
  const alertTitles = {
    login_new_device: 'New Device Login Detected',
    password_changed: 'Password Changed Successfully', 
    api_key_created: 'New API Key Created',
    suspicious_activity: 'Suspicious Account Activity'
  };

  const alertMessages = {
    login_new_device: 'A new login was detected from an unrecognized device.',
    password_changed: 'Your account password has been successfully changed.',
    api_key_created: 'A new API key has been created for your account.',
    suspicious_activity: 'We detected unusual activity on your account.'
  };

  const content = `
    <div style="text-align: center;">
        <div style="background-color: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h2 style="color: #ef4444; margin: 0 0 15px 0; font-size: 22px;">🚨 ${alertTitles[alertType]}</h2>
        </div>
        
        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 12px;">
            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                ${alertMessages[alertType]}
            </p>
            
            <div style="background-color: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h3 style="color: #fbbf24; margin: 0 0 15px 0; font-size: 16px;">Details:</h3>
                <table style="width: 100%; color: #e2e8f0; font-size: 14px;">
                    ${details.ip ? `<tr><td><strong>IP Address:</strong></td><td>${details.ip}</td></tr>` : ''}
                    ${details.location ? `<tr><td><strong>Location:</strong></td><td>${details.location}</td></tr>` : ''}
                    ${details.device ? `<tr><td><strong>Device:</strong></td><td>${details.device}</td></tr>` : ''}
                    ${details.timestamp ? `<tr><td><strong>Time:</strong></td><td>${new Date(details.timestamp).toLocaleString()}</td></tr>` : ''}
                </table>
            </div>
            
            <div style="margin: 30px 0;">
                <a href="${getBaseUrl()}/security" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px;">
                    Review Security
                </a>
                <a href="${getBaseUrl()}/support" style="display: inline-block; background: rgba(255,255,255,0.1); color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px;">
                    Contact Support
                </a>
            </div>
        </div>
    </div>
  `;

  return sendEmail({
    to: email,
    from: 'security@bitpandapro.com',
    subject: `Security Alert: ${alertTitles[alertType]} - BITPANDA PRO`,
    html: content
  });
}

// Template for trade confirmations
export async function sendTradeConfirmationEmail(
  email: string,
  tradeData: {
    id: string;
    type: 'buy' | 'sell';
    asset: string;
    amount: string;
    price: string;
    total: string;
    fee: string;
    timestamp: Date;
  }
): Promise<boolean> {
  const content = `
    <div style="text-align: center;">
        <h2 style="color: #10b981; margin: 0 0 30px 0; font-size: 24px;">
            ✅ Trade ${tradeData.type === 'buy' ? 'Purchase' : 'Sale'} Confirmed
        </h2>
        
        <div style="background-color: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 12px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                <h3 style="color: #ffffff; margin: 0; font-size: 20px;">
                    ${tradeData.type === 'buy' ? 'Bought' : 'Sold'} ${tradeData.amount} ${tradeData.asset}
                </h3>
            </div>
            
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 12px; text-align: left; color: #94a3b8; font-weight: 600;">Trade ID:</td>
                    <td style="padding: 12px; text-align: right; color: #e2e8f0; font-family: monospace;">${tradeData.id}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 12px; text-align: left; color: #94a3b8; font-weight: 600;">Asset:</td>
                    <td style="padding: 12px; text-align: right; color: #e2e8f0; font-weight: 600;">${tradeData.asset}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 12px; text-align: left; color: #94a3b8; font-weight: 600;">Amount:</td>
                    <td style="padding: 12px; text-align: right; color: #e2e8f0;">${tradeData.amount}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 12px; text-align: left; color: #94a3b8; font-weight: 600;">Price per unit:</td>
                    <td style="padding: 12px; text-align: right; color: #e2e8f0;">$${tradeData.price}</td>
                </tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <td style="padding: 12px; text-align: left; color: #94a3b8; font-weight: 600;">Trading Fee:</td>
                    <td style="padding: 12px; text-align: right; color: #fbbf24;">$${tradeData.fee}</td>
                </tr>
                <tr style="background-color: rgba(16, 185, 129, 0.1);">
                    <td style="padding: 15px; text-align: left; color: #10b981; font-weight: bold; font-size: 16px;">Total ${tradeData.type === 'buy' ? 'Paid' : 'Received'}:</td>
                    <td style="padding: 15px; text-align: right; color: #10b981; font-weight: bold; font-size: 18px;">$${tradeData.total}</td>
                </tr>
            </table>
            
            <div style="margin: 30px 0;">
                <a href="${getBaseUrl()}/transaction-history" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    View Transaction History
                </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin-top: 25px; line-height: 1.5;">
                This confirmation email is for your records. The transaction has been processed successfully.
            </p>
        </div>
    </div>
  `;

  return sendEmail({
    to: email,
    from: 'trading@bitpandapro.com',
    subject: `Trade Confirmation: ${tradeData.type.toUpperCase()} ${tradeData.asset} - BITPANDA PRO`,
    html: content
  });
}
