# 📧 Resend Email Integration Setup

## ⚠️ REQUIRED: Real Email Service

This ApniSec application uses **real email delivery** via Resend API. This is **NOT optional** and **NOT a mock service**.

## 🚀 Quick Setup

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key
1. Login to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Copy the API key (starts with `re_`)

### 3. Configure Environment
Add your API key to `.env`:
```env
RESEND_API_KEY=re_your_actual_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

### 4. Domain Setup (Production)
For production, you need to verify your domain:
1. Go to **Domains** in Resend dashboard
2. Add your domain
3. Add the required DNS records
4. Wait for verification

For development, you can use Resend's test domain.

## 📧 Email Templates

The application sends three types of emails:

### Welcome Email
- **Trigger**: User registration
- **Template**: Professional welcome message with platform features
- **Recipient**: New user's email address

### Issue Created Email  
- **Trigger**: New security issue creation
- **Template**: Issue details with title and type
- **Recipient**: Issue creator's email address

### Profile Update Email
- **Trigger**: User profile modification
- **Template**: Security notification about profile changes
- **Recipient**: User's email address

## 🔧 Technical Implementation

### EmailService Class
```typescript
export class EmailService {
  private resend: Resend;
  
  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required');
    }
    this.resend = new Resend(apiKey);
  }
  
  // Real email sending methods...
}
```

### Error Handling
- **Missing API Key**: Application throws error on startup
- **Invalid API Key**: Resend API returns authentication error
- **Email Delivery Failure**: Logged but doesn't block user operations
- **Rate Limits**: Handled by Resend automatically

## 🧪 Testing

### Development Testing
1. Use your real email address in registration
2. Check your inbox for welcome email
3. Create an issue and verify notification email
4. Update profile and check confirmation email

### Production Checklist
- ✅ Valid Resend API key configured
- ✅ Domain verified in Resend
- ✅ FROM_EMAIL matches verified domain
- ✅ DNS records properly configured
- ✅ Email templates tested

## 🚨 Troubleshooting

### Common Issues

**"RESEND_API_KEY is required" Error**
- Solution: Add valid API key to `.env` file

**"Authentication failed" Error**  
- Solution: Verify API key is correct and active

**Emails not delivered**
- Check spam folder
- Verify recipient email address
- Check Resend dashboard for delivery status

**Domain verification issues**
- Ensure DNS records are correctly added
- Wait up to 24 hours for DNS propagation
- Use Resend's DNS checker tool

## 📊 Monitoring

Monitor email delivery in Resend dashboard:
- **Logs**: View all sent emails
- **Analytics**: Delivery rates and performance
- **Webhooks**: Real-time delivery notifications
- **Suppressions**: Bounced/blocked addresses

## 💰 Pricing

Resend offers:
- **Free Tier**: 3,000 emails/month
- **Pro Plans**: Higher limits and advanced features
- **Pay-as-you-go**: For variable usage

Perfect for development and small production deployments.

---

**⚡ Ready to send real emails!** Your ApniSec application now has professional email delivery powered by Resend.