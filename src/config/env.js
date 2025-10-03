// Centralized environment variable access for client-side (Vite)
// Uses import.meta.env for Vite and falls back to window overrides for testing

function readEnv(key, windowFallbackKey) {
    try {
        // Vite-style env (exposed only if prefixed with VITE_)
        if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env[key] !== 'undefined') {
            return import.meta.env[key];
        }
    } catch (_) {}
    try {
        // Optional runtime overrides for development/testing
        if (typeof window !== 'undefined' && window && window[windowFallbackKey]) {
            return window[windowFallbackKey];
        }
    } catch (_) {}
    return undefined;
}

export const RAZORPAY_KEY_ID = readEnv('VITE_RAZORPAY_KEY_ID', '__RAZORPAY_KEY_ID__');
export const CURRENCY = readEnv('VITE_CURRENCY', '__CURRENCY__') || 'INR';

export const EMAILJS_SERVICE_ID = readEnv('VITE_EMAILJS_SERVICE_ID', '__EMAILJS_SERVICE_ID__');
export const EMAILJS_PUBLIC_KEY = readEnv('VITE_EMAILJS_PUBLIC_KEY', '__EMAILJS_PUBLIC_KEY__');
export const EMAILJS_TEMPLATE_ID = readEnv('VITE_EMAILJS_TEMPLATE_ID', '__EMAILJS_TEMPLATE_ID__');
export const EMAILJS_OTP_TEMPLATE_ID = readEnv('VITE_EMAILJS_OTP_TEMPLATE_ID', '__EMAILJS_OTP_TEMPLATE_ID__');
export const EMAILJS_BOOKING_TEMPLATE_ID = readEnv('VITE_EMAILJS_BOOKING_TEMPLATE_ID', '__EMAILJS_BOOKING_TEMPLATE_ID__');

export const EMAIL_FROM_NAME = readEnv('VITE_EMAIL_FROM_NAME', '__EMAIL_FROM_NAME__') || 'अर्चनम्';
export const EMAIL_FROM_ADDRESS = readEnv('VITE_EMAIL_FROM_ADDRESS', '__EMAIL_FROM_ADDRESS__') || '';

export const MERCHANT_NAME = readEnv('VITE_MERCHANT_NAME', '__MERCHANT_NAME__') || 'अर्चनम्';
export const UPI_ID = readEnv('VITE_UPI_ID', '__UPI_ID__');

// Existing key in the project
export const GEMINI_API_KEY = readEnv('VITE_GEMINI_API_KEY', '__GEMINI_API_KEY__');

export function ensureEnvPresent(name, value) {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
}


