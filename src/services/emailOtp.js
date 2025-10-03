// EmailJS service for OTP emails only
import emailjs from '@emailjs/browser';
import {
    EMAILJS_SERVICE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_OTP_TEMPLATE_ID,
    EMAIL_FROM_NAME,
    EMAIL_FROM_ADDRESS
} from '../config/env.js';

const EMAILJS_CONFIG = {
    serviceId: EMAILJS_SERVICE_ID,
    otpTemplateId: EMAILJS_OTP_TEMPLATE_ID,
    publicKey: EMAILJS_PUBLIC_KEY,
    fromName: EMAIL_FROM_NAME,
    fromEmail: EMAIL_FROM_ADDRESS
};

if (EMAILJS_CONFIG.publicKey) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

export async function sendOtpEmail(email, otp, language = 'en') {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address');
    }
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
        throw new Error('Invalid OTP format');
    }

    const recipientName = email.split('@')[0];
    const templateParams = {
        to_email: email,
        to: email,
        user_email: email,
        reply_to: email,
        email: email,
        to_name: recipientName,
        from_name: EMAILJS_CONFIG.fromName,
        from_email: EMAILJS_CONFIG.fromEmail,
        subject: language === 'hi' ? 'अर्चनम् बुकिंग के लिए आपका OTP' : 'Your OTP for Archanam Booking',
        otp: otp,
        language: language
    };

    const templateId = EMAILJS_CONFIG.otpTemplateId;
    console.log('📧 [OTP] Sending via EmailJS', { templateId, to: email });

    const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        templateId,
        templateParams
    );

    return { success: true, messageId: result.text, provider: 'EmailJS' };
}

export function getOtpEmailConfig() {
    return { serviceId: EMAILJS_CONFIG.serviceId, templateId: EMAILJS_CONFIG.otpTemplateId };
}



