# EmailJS Setup Guide

## The Error You're Seeing

The error `❌ Failed to send OTP to lopa121515@gmail.com: undefined` and `The public key is required. Visit https://dashboard.emailjs.com/admin/account` occurs because the EmailJS service is not properly configured.

## Quick Fix

1. **Create a `.env` file** in your project root with the following content:

```env
# EmailJS Configuration
# Get these values from https://dashboard.emailjs.com/admin/account
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_OTP_TEMPLATE_ID=your_otp_template_id_here
VITE_EMAILJS_BOOKING_TEMPLATE_ID=your_booking_template_id_here

# Email Configuration
VITE_EMAIL_FROM_NAME=अर्चनम्
VITE_EMAIL_FROM_ADDRESS=your_email@domain.com

# Razorpay Configuration (if needed)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here

# Other Configuration
VITE_CURRENCY=INR
VITE_MERCHANT_NAME=अर्चनम्
VITE_UPI_ID=your_upi_id@paytm

# Gemini API (if needed)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Step-by-Step EmailJS Setup

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account
- Verify your email

### 2. Get Your Credentials
- Go to [https://dashboard.emailjs.com/admin/account](https://dashboard.emailjs.com/admin/account)
- Copy your **Public Key** (this is your `VITE_EMAILJS_PUBLIC_KEY`)

### 3. Set Up Email Service
- Go to [https://dashboard.emailjs.com/admin/integration](https://dashboard.emailjs.com/admin/integration)
- Add your email service (Gmail, Outlook, etc.)
- Note your **Service ID** (this is your `VITE_EMAILJS_SERVICE_ID`)

### 4. Create Email Templates
- Go to [https://dashboard.emailjs.com/admin/templates](https://dashboard.emailjs.com/admin/templates)
- Create templates for:
  - **OTP Template**: For sending OTP codes
  - **Booking Template**: For booking confirmations
- Note the **Template IDs** for each

### 5. Update Your .env File
Replace the placeholder values in your `.env` file with the actual values from EmailJS dashboard.

## Alternative: Disable EmailJS for Development

If you want to test without setting up EmailJS, you can modify the OTP service to use a mock email service for development.

## After Setup

1. Restart your development server (`npm run dev`)
2. Test the OTP functionality
3. Check the browser console for any remaining errors

## Troubleshooting

- Make sure all environment variables start with `VITE_`
- Restart the development server after changing `.env`
- Check the browser console for detailed error messages
- Verify your EmailJS service is active and templates are published
