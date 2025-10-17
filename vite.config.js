import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Expose environment variables without VITE_ prefix
  define: {
    'import.meta.env.RAZORPAY_KEY_ID': JSON.stringify(process.env.RAZORPAY_KEY_ID),
    'import.meta.env.CURRENCY': JSON.stringify(process.env.CURRENCY),
    'import.meta.env.MERCHANT_NAME': JSON.stringify(process.env.MERCHANT_NAME),
    'import.meta.env.UPI_ID': JSON.stringify(process.env.UPI_ID),
    'import.meta.env.EMAILJS_SERVICE_ID': JSON.stringify(process.env.EMAILJS_SERVICE_ID),
    'import.meta.env.EMAILJS_PUBLIC_KEY': JSON.stringify(process.env.EMAILJS_PUBLIC_KEY),
    'import.meta.env.EMAILJS_TEMPLATE_ID': JSON.stringify(process.env.EMAILJS_TEMPLATE_ID),
    'import.meta.env.EMAILJS_OTP_TEMPLATE_ID': JSON.stringify(process.env.EMAILJS_OTP_TEMPLATE_ID),
    'import.meta.env.EMAILJS_BOOKING_TEMPLATE_ID': JSON.stringify(process.env.EMAILJS_BOOKING_TEMPLATE_ID),
    'import.meta.env.EMAIL_FROM_NAME': JSON.stringify(process.env.EMAIL_FROM_NAME),
    'import.meta.env.EMAIL_FROM_ADDRESS': JSON.stringify(process.env.EMAIL_FROM_ADDRESS),
    'import.meta.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
    'import.meta.env.WHATSAPP_PHONE_NUMBER_ID': JSON.stringify(process.env.WHATSAPP_PHONE_NUMBER_ID),
    'import.meta.env.WHATSAPP_ACCESS_TOKEN': JSON.stringify(process.env.WHATSAPP_ACCESS_TOKEN),
    'import.meta.env.WHATSAPP_RECIPIENT_NUMBER': JSON.stringify(process.env.WHATSAPP_RECIPIENT_NUMBER),
  }
})
