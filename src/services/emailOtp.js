// EmailJS service for OTP emails only
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
    serviceId: 'service_y8omb6d',
    otpTemplateId: 'template_n6h5s5t',
    publicKey: '2kX9-9LSRIJM5TiOd',
    fromName: 'अर्चनम्',
    fromEmail: 'danteonhunt@gmail.com'
};

emailjs.init(EMAILJS_CONFIG.publicKey);

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


