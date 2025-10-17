import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    
    // Expose environment variables without VITE_ prefix
    define: {
      'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.RAZORPAY_KEY_ID': JSON.stringify(env.RAZORPAY_KEY_ID),
      'import.meta.env.CURRENCY': JSON.stringify(env.CURRENCY),
      'import.meta.env.MERCHANT_NAME': JSON.stringify(env.MERCHANT_NAME),
      'import.meta.env.UPI_ID': JSON.stringify(env.UPI_ID),
      'import.meta.env.EMAILJS_SERVICE_ID': JSON.stringify(env.EMAILJS_SERVICE_ID),
      'import.meta.env.EMAILJS_PUBLIC_KEY': JSON.stringify(env.EMAILJS_PUBLIC_KEY),
      'import.meta.env.EMAILJS_BOOKING_TEMPLATE_ID': JSON.stringify(env.EMAILJS_BOOKING_TEMPLATE_ID),
      'import.meta.env.EMAIL_FROM_NAME': JSON.stringify(env.EMAIL_FROM_NAME),
      'import.meta.env.EMAIL_FROM_ADDRESS': JSON.stringify(env.EMAIL_FROM_ADDRESS),
    }
  }
})
