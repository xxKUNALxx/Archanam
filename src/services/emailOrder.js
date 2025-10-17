// EmailJS service for admin order confirmation only
import emailjs from '@emailjs/browser';
// Environment variable access
const EMAILJS_SERVICE_ID = import.meta.env.EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_BOOKING_TEMPLATE_ID = import.meta.env.EMAILJS_BOOKING_TEMPLATE_ID;
const EMAIL_FROM_NAME = import.meta.env.EMAIL_FROM_NAME;
const EMAIL_FROM_ADDRESS = import.meta.env.EMAIL_FROM_ADDRESS;

const EMAILJS_CONFIG = {
    serviceId: EMAILJS_SERVICE_ID,
    bookingTemplateId: EMAILJS_BOOKING_TEMPLATE_ID,
    publicKey: EMAILJS_PUBLIC_KEY,
    fromName: EMAIL_FROM_NAME,
    fromEmail: EMAIL_FROM_ADDRESS
};

if (EMAILJS_CONFIG.publicKey) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

export async function sendBookingConfirmationEmail(bookingData) {
    const hostEmail = EMAILJS_CONFIG.fromEmail;

    const subject = `New Booking ${bookingData.bookingId || ''} - ${bookingData.pujaType || 'Service'}`;
    const messageHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h2 style=\"color:#1B5E20;\">New Puja Booking</h2>
            <table cellpadding=\"8\" cellspacing=\"0\" style=\"width:100%; border-collapse:collapse;\">
                <tr><td style=\"border-bottom:1px solid #eee; width:35%\"><strong>Customer Name</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.name || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Phone</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.phone || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Email</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.email || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Puja Type</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.pujaType || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Date</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.date || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Time</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.time || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Amount</strong></td><td style=\"border-bottom:1px solid #eee;\">₹${bookingData.amount ?? ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Address</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.address || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Special Requests</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.specialRequests || 'None'}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Booking ID</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.bookingId || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Payment Status</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.paymentStatus || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Payment ID</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.paymentId || ''}</td></tr>
                <tr><td style=\"border-bottom:1px solid #eee;\"><strong>Order ID</strong></td><td style=\"border-bottom:1px solid #eee;\">${bookingData.orderId || ''}</td></tr>
            </table>
        </div>`;

    const templateParams = {
        to_email: hostEmail,
        to: hostEmail,
        user_email: hostEmail,
        email: hostEmail,
        reply_to: hostEmail,
        subject,
        message: messageHtml,
        message_html: messageHtml,
        html: messageHtml,
        content: messageHtml,
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        customer_email: bookingData.email,
        puja_type: bookingData.pujaType,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        amount: bookingData.amount,
        address: bookingData.address,
        special_requests: bookingData.specialRequests || 'None',
        booking_id: bookingData.bookingId,
        payment_status: bookingData.paymentStatus,
        payment_id: bookingData.paymentId,
        order_id: bookingData.orderId,
        from_name: 'Archanam Booking System',
        from_email: EMAILJS_CONFIG.fromEmail
    };

    const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.bookingTemplateId,
        templateParams
    );
    return { success: true, messageId: result.text, provider: 'EmailJS' };
}

export function getOrderEmailConfig() {
    return { serviceId: EMAILJS_CONFIG.serviceId, templateId: EMAILJS_CONFIG.bookingTemplateId };
}



