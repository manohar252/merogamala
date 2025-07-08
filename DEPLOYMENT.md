# MERO GAMALA - Deployment Guide

## Overview

This guide explains how to deploy the MERO GAMALA plant store application with integrated payment gateways (eSewa, FonePay, and Citizen Bank QR).

## Pre-Deployment Checklist

### 1. Payment Gateway Registration

Before deploying to production, ensure you have registered with and obtained credentials from:

- **eSewa**: Register at [eSewa Merchant Portal](https://merchant.esewa.com.np/)
- **FonePay**: Contact FonePay for merchant registration
- **Citizen Bank**: Register for QR payment services with Citizen Bank

### 2. Required Credentials

You'll need the following credentials for each payment gateway:

#### eSewa
- Merchant ID
- Success URL (your website's success page)
- Failure URL (your website's failure page)

#### FonePay
- Merchant Code
- Username
- Password
- Secret Key
- API Base URL

#### Citizen Bank
- Merchant ID
- Secret Key
- API Base URL

## Deployment Steps

### 1. Environment Configuration

1. Copy `.env.example` to `.env.local` (for local production testing) or set environment variables in your hosting platform
2. Replace all placeholder values with your actual payment gateway credentials
3. Ensure all sensitive credentials are kept secure and never committed to version control

### 2. Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 3. Test Payment Integration

Before going live:

1. Test each payment gateway in sandbox/demo mode
2. Verify order creation and WhatsApp notifications
3. Test the admin panel functionality
4. Ensure mobile responsiveness

### 4. Deploy to Hosting Platform

#### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard under Project Settings > Environment Variables.

#### For Netlify:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod --dir=dist
```

Set environment variables in Netlify dashboard under Site Settings > Environment Variables.

#### For Traditional Hosting:
1. Upload the `dist` folder contents to your web server
2. Configure your web server to serve the single-page application correctly
3. Set up environment variables on your server

## Production Configuration

### 1. Payment Gateway Settings

In production, the application will:
- Use real payment gateway APIs (not demo mode)
- Redirect users to actual payment portals
- Process real transactions

### 2. Security Considerations

- **HTTPS Required**: All payment gateways require HTTPS in production
- **Environment Variables**: Store all sensitive data in environment variables
- **CORS Configuration**: Ensure your domain is whitelisted with payment providers
- **Webhook Security**: Implement proper signature verification for payment callbacks

### 3. WhatsApp Integration (Optional)

To enable WhatsApp order confirmations:
1. Set up WhatsApp Business API
2. Configure `VITE_WHATSAPP_API_URL` and `VITE_WHATSAPP_AUTH_TOKEN`
3. Test message delivery

## Post-Deployment

### 1. Monitor Payment Transactions

- Set up logging for payment events
- Monitor success/failure rates
- Track order completion rates

### 2. Customer Support

- Provide clear contact information for payment issues
- Document common payment problems and solutions
- Set up order tracking system

### 3. Admin Access

The admin panel is accessible at `/admin` with default credentials:
- Username: `admin`
- Password: `admin123`

**Important**: Change these credentials immediately after deployment for security.

## Development vs Production Differences

| Feature | Development | Production |
|---------|-------------|------------|
| Payment Gateways | Demo/Mock mode | Real transactions |
| WhatsApp | Console logs only | Actual messages sent |
| Order Processing | Simulated | Real order fulfillment |
| Admin Access | Default credentials | Custom secure credentials |

## Troubleshooting

### Common Issues

1. **Payment Gateway Errors**
   - Verify credentials are correct
   - Check if your domain is whitelisted
   - Ensure HTTPS is enabled

2. **Order Not Creating**
   - Check browser console for JavaScript errors
   - Verify form validation is passing
   - Ensure admin panel shows orders

3. **Mobile Issues**
   - Test QR code scanning on actual devices
   - Verify mobile banking app compatibility
   - Check responsive design on various screen sizes

### Getting Help

For technical support:
- Check the browser console for error messages
- Review network requests in developer tools
- Contact your payment gateway provider for API issues

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Regularly update npm packages for security
2. **Monitor Logs**: Check for payment processing errors
3. **Backup Data**: Ensure order data is backed up regularly
4. **Performance Monitoring**: Monitor site performance and load times

### Updates

When updating the application:
1. Test in a staging environment first
2. Backup your current deployment
3. Deploy during low-traffic hours
4. Monitor for issues post-deployment

## Support

For issues related to:
- **eSewa Integration**: Contact eSewa technical support
- **FonePay Integration**: Contact FonePay technical support  
- **Citizen Bank Integration**: Contact Citizen Bank technical support
- **Application Issues**: Check the GitHub repository or contact the development team

---

**Note**: This application includes demo modes for development. Always test thoroughly before deploying to production with real payment credentials.