// Email service for OTP delivery
// Uses EmailJS for browser-compatible email sending

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
    // Get these from https://www.emailjs.com/
    serviceId: 'service_y8omb6d', // Replace with your actual EmailJS service ID
    templateId: 'template_n6h5s5t', // legacy default
    otpTemplateId: 'template_n6h5s5t', // OTP template ID
    bookingTemplateId: 'template_snx5d52', // Admin booking template ID
    publicKey: '2kX9-9LSRIJM5TiOd', // Replace with your EmailJS public key
    fromName: 'अर्चनम्',
    fromEmail: 'danteonhunt@gmail.com'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Email templates
const EMAIL_TEMPLATES = {
    OTP_ENGLISH: {
        subject: 'Your OTP for Archanam Booking',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🕉️ अर्चनम्</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Spiritual Services & Puja Booking</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1B5E20; margin-top: 0;">Your OTP for Booking</h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        Hello!<br><br>
                        You have requested to book a puja service. Please use the following OTP to verify your booking:
                    </p>
                    
                    <div style="background: white; border: 2px solid #FFB300; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #1B5E20; font-size: 36px; margin: 0; letter-spacing: 5px; font-family: monospace;">{OTP}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        <strong>Important:</strong>
                        <ul style="color: #666; font-size: 14px;">
                            <li>This OTP is valid for <strong>2 minutes</strong> only</li>
                            <li>Do not share this OTP with anyone</li>
                            <li>If you didn't request this, please ignore this email</li>
                        </ul>
                    </p>
                    
                    <div style="background: #e8f5e8; border-left: 4px solid #1B5E20; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="margin: 0; color: #1B5E20; font-weight: bold;">
                            🙏 Thank you for choosing Archanam for your spiritual needs!
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2025 Archanam. All rights reserved.</p>
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        `
    },
    
    OTP_HINDI: {
        subject: 'अर्चनम् बुकिंग के लिए आपका OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🕉️ अर्चनम्</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">आध्यात्मिक सेवाएं और पूजा बुकिंग</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1B5E20; margin-top: 0;">आपका बुकिंग OTP</h2>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.6;">
                        नमस्ते!<br><br>
                        आपने पूजा सेवा बुक करने का अनुरोध किया है। कृपया अपनी बुकिंग सत्यापित करने के लिए निम्नलिखित OTP का उपयोग करें:
                    </p>
                    
                    <div style="background: white; border: 2px solid #FFB300; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #1B5E20; font-size: 36px; margin: 0; letter-spacing: 5px; font-family: monospace;">{OTP}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        <strong>महत्वपूर्ण:</strong>
                        <ul style="color: #666; font-size: 14px;">
                            <li>यह OTP केवल <strong>2 मिनट</strong> तक वैध है</li>
                            <li>इस OTP को किसी के साथ साझा न करें</li>
                            <li>यदि आपने यह अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें</li>
                        </ul>
                    </p>
                    
                    <div style="background: #e8f5e8; border-left: 4px solid #1B5E20; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="margin: 0; color: #1B5E20; font-weight: bold;">
                            🙏 आपकी आध्यात्मिक आवश्यकताओं के लिए अर्चनम् चुनने के लिए धन्यवाद!
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2025 अर्चनम्। सर्वाधिकार सुरक्षित।</p>
                    <p>यह एक स्वचालित संदेश है। कृपया इस ईमेल का जवाब न दें।</p>
                </div>
            </div>
        `
    },
    
    BOOKING_CONFIRMATION: {
        subject: 'New Puja Booking - Archanam',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; background: linear-gradient(135deg, #1B5E20, #2E7D32); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🕉️ अर्चनम्</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New Puja Booking Received</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1B5E20; margin-top: 0;">New Booking Details</h2>
                    
                    <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1B5E20; margin-top: 0;">Customer Information</h3>
                        <p><strong>Name:</strong> {{customer_name}}</p>
                        <p><strong>Phone:</strong> {{customer_phone}}</p>
                        <p><strong>Email:</strong> {{customer_email}}</p>
                    </div>
                    
                    <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1B5E20; margin-top: 0;">Puja Details</h3>
                        <p><strong>Puja Type:</strong> {{puja_type}}</p>
                        <p><strong>Date:</strong> {{booking_date}}</p>
                        <p><strong>Time:</strong> {{booking_time}}</p>
                        <p><strong>Amount:</strong> ₹{{amount}}</p>
                    </div>
                    
                    <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1B5E20; margin-top: 0;">Address</h3>
                        <p>{{address}}</p>
                    </div>
                    
                    {{#special_requests}}
                    <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1B5E20; margin-top: 0;">Special Requests</h3>
                        <p>{{special_requests}}</p>
                    </div>
                    {{/special_requests}}
                    
                    <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #1B5E20; margin-top: 0;">Booking Information</h3>
                        <p><strong>Booking ID:</strong> {{booking_id}}</p>
                        <p><strong>Payment Status:</strong> {{payment_status}}</p>
                        <p><strong>Booking Time:</strong> {{booking_timestamp}}</p>
                    </div>
                    
                    <div style="background: #e8f5e8; border-left: 4px solid #1B5E20; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <p style="margin: 0; color: #1B5E20; font-weight: bold;">
                            📞 Please contact the customer to confirm the booking and provide further instructions.
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2025 Archanam. All rights reserved.</p>
                    <p>This is an automated booking notification.</p>
                </div>
            </div>
        `
    }
};

// Send OTP email using EmailJS
export async function sendOtpEmail(email, otp, language = 'en') {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address');
    }
    
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
        throw new Error('Invalid OTP format');
    }
    
    // Validate EmailJS configuration (only fail if actually missing)
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
        throw new Error('EmailJS configuration incomplete. Please set up your EmailJS credentials.');
    }
    
    try {
        const template = language === 'hi' ? EMAIL_TEMPLATES.OTP_HINDI : EMAIL_TEMPLATES.OTP_ENGLISH;
        
        const recipientName = email.split('@')[0];
        const templateParams = {
            // Recipient variants to satisfy different template setups
            to_email: email,
            to: email,
            user_email: email,
            reply_to: email,
            email: email,
            // Names
            to_name: recipientName,
            from_name: EMAILJS_CONFIG.fromName,
            from_email: EMAILJS_CONFIG.fromEmail,
            // Content
            subject: template.subject,
            otp: otp,
            message: template.html.replace('{OTP}', otp),
            language: language
        };
        
        const otpTemplateToUse = EMAILJS_CONFIG.otpTemplateId || EMAILJS_CONFIG.templateId;
        console.log(`📧 Sending OTP email via EmailJS`);
        console.log(`   → To: ${email}`);
        console.log(`   → Service ID: ${EMAILJS_CONFIG.serviceId}`);
        console.log(`   → Template ID (OTP): ${otpTemplateToUse}`);
        console.log(`   → Public Key Present: ${!!EMAILJS_CONFIG.publicKey}`);
        console.log(`   → Params Preview:`, { to_email: templateParams.to_email, otp: templateParams.otp, subject: template.subject });
        
        const result = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.bookingTemplateId || EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        console.log(`✅ OTP email sent successfully to ${email}`);
        console.log(`📧 Message ID: ${result.text}`);
        console.log(`📧 Full Result:`, result);
        
        return {
            success: true,
            messageId: result.text,
            provider: 'EmailJS'
        };
        
    } catch (error) {
        console.error(`❌ Failed to send OTP email to ${email}:`);
        console.error(`📧 Error Status:`, error.status);
        console.error(`📧 Error Text:`, error.text);
        console.error(`📧 Error Message:`, error.message);
        console.error(`📧 Full Error:`, error);
        
        // Provide more specific error messages
        let errorMessage = 'Email sending failed';
        if (error.status === 400) {
            errorMessage = 'Invalid template parameters or service configuration';
        } else if (error.status === 401) {
            errorMessage = 'Invalid EmailJS credentials or service not authorized';
        } else if (error.status === 403) {
            errorMessage = 'EmailJS service access denied';
        } else if (error.status === 404) {
            errorMessage = 'EmailJS service or template not found';
        } else if (error.status === 429) {
            errorMessage = 'EmailJS rate limit exceeded';
        } else if (error.status >= 500) {
            errorMessage = 'EmailJS server error';
        }
        
        throw new Error(`${errorMessage}: ${error.text || error.message}`);
    }
}

// Send booking confirmation email to host
export async function sendBookingConfirmationEmail(bookingData) {
    // Send to your inbox (EmailJS recipient)
    const hostEmail = EMAILJS_CONFIG.fromEmail; // Ensure this equals the inbox you want

    // Build a rich HTML with all details so even generic templates show content
    const subject = `New Booking ${bookingData.bookingId || ''} - ${bookingData.pujaType || 'Service'}`;
    const messageHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h2 style="color:#1B5E20;">New Puja Booking</h2>
            <table cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
                <tr><td style="border-bottom:1px solid #eee; width:35%"><strong>Customer Name</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.name || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.phone || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.email || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Puja Type</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.pujaType || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.date || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Time</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.time || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Amount</strong></td><td style="border-bottom:1px solid #eee;">₹${bookingData.amount ?? ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Address</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.address || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Special Requests</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.specialRequests || 'None'}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Booking ID</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.bookingId || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Payment Status</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.paymentStatus || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Payment ID</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.paymentId || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Order ID</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.orderId || ''}</td></tr>
            </table>
            <p style="color:#777; font-size:12px; margin-top:16px;">Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
    `;

    try {
        const templateParams = {
            // Recipient variants
            to_email: hostEmail,
            to: hostEmail,
            user_email: hostEmail,
            email: hostEmail,
            reply_to: hostEmail,

            // Subject/message variants (to match common EmailJS templates)
            subject,
            message: messageHtml,
            message_html: messageHtml,
            html: messageHtml,
            content: messageHtml,

            // Individual fields for templates that map variables
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

        // Map to your existing template structure (Order-style)
        // - order_id already supplied above for your header
        // - email for footer notice
        // - cost fields (flat, since nested objects may not bind in some templates)
        templateParams.order_id = templateParams.order_id || (bookingData.bookingId || '');
        templateParams.email = bookingData.email || '';
        templateParams['cost.shipping'] = '0.00';
        templateParams['cost.tax'] = '0.00';
        templateParams['cost.total'] = typeof bookingData.amount === 'number' ? bookingData.amount.toFixed(2) : `${bookingData.amount || '0.00'}`;

        // Orders list for {{#orders}} iteration: a single line item representing the puja/service
        templateParams.orders = [
            {
                image_url: 'https://i.imgur.com/tQv4YvN.png',
                name: bookingData.pujaType || 'Puja Service',
                units: 1,
                price: typeof bookingData.amount === 'number' ? bookingData.amount.toFixed(2) : `${bookingData.amount || '0.00'}`
            }
        ];

        console.log(`📧 Sending booking confirmation to host: ${hostEmail}`);
        const result = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            otpTemplateToUse,
            templateParams
        );

        return {
            success: true,
            messageId: result.text,
            provider: 'EmailJS'
        };
    } catch (error) {
        console.error(`❌ Failed to send booking confirmation to host:`, error);
        throw new Error(`Booking confirmation email failed: ${error.text || error.message}`);
    }
}

// Send booking confirmation to customer (client-facing email)
export async function sendBookingCustomerEmail(bookingData) {
    const customerEmail = bookingData.email;
    const subject = `Your Booking is Confirmed - ${bookingData.pujaType || 'Puja Service'}`;
    const messageHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h2 style="color:#1B5E20;">Booking Confirmed ✅</h2>
            <p>Dear ${bookingData.name || 'Devotee'},</p>
            <p>Thank you for your booking. We have received your payment and confirmed your ${bookingData.pujaType || 'service'}.</p>
            <table cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
                <tr><td style="border-bottom:1px solid #eee; width:35%"><strong>Booking ID</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.bookingId || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Puja Type</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.pujaType || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.date || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Time</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.time || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Amount Paid</strong></td><td style="border-bottom:1px solid #eee;">₹${typeof bookingData.amount === 'number' ? bookingData.amount.toFixed(2) : (bookingData.amount || '')}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Payment ID</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.paymentId || ''}</td></tr>
                <tr><td style="border-bottom:1px solid #eee;"><strong>Order ID</strong></td><td style="border-bottom:1px solid #eee;">${bookingData.orderId || ''}</td></tr>
            </table>
            <p style="margin-top:16px">Our team will contact you with further details. If you have any questions, reply to this email.</p>
            <p style="color:#777; font-size:12px; margin-top:16px;">Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
    `;

    try {
        const templateParams = {
            to_email: customerEmail,
            to: customerEmail,
            user_email: customerEmail,
            email: customerEmail,
            reply_to: EMAILJS_CONFIG.fromEmail,
            subject,
            message: messageHtml,
            message_html: messageHtml,
            html: messageHtml,
            content: messageHtml,
            // Common fields for template mapping
            customer_name: bookingData.name,
            puja_type: bookingData.pujaType,
            booking_id: bookingData.bookingId,
            booking_date: bookingData.date,
            booking_time: bookingData.time,
            amount: bookingData.amount,
            payment_id: bookingData.paymentId,
            order_id: bookingData.orderId,
            from_name: EMAILJS_CONFIG.fromName,
            from_email: EMAILJS_CONFIG.fromEmail
        };

        const result = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        return { success: true, messageId: result.text, provider: 'EmailJS' };
    } catch (error) {
        console.error('❌ Failed to send booking confirmation to customer:', error);
        throw new Error(`Customer confirmation email failed: ${error.text || error.message}`);
    }
}

// Test email function
export async function testEmail(email) {
    const testOtp = '123456';
    console.log(`🧪 Testing email to ${email} with OTP: ${testOtp}`);
    
    try {
        const result = await sendOtpEmail(email, testOtp);
        console.log('✅ Test email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('❌ Test email failed:', error.message);
        throw error;
    }
}

// Get EmailJS configuration info
export function getEmailProviderInfo() {
    return {
        currentProvider: 'EmailJS',
        availableProviders: ['EmailJS'],
        config: EMAILJS_CONFIG
    };
}

// Validate EmailJS configuration
export function validateEmailConfig() {
    const missingFields = [];
    
    if (!EMAILJS_CONFIG.serviceId || EMAILJS_CONFIG.serviceId.includes('YOUR_')) {
        missingFields.push('serviceId');
    }
    
    if (!EMAILJS_CONFIG.templateId || EMAILJS_CONFIG.templateId.includes('YOUR_')) {
        missingFields.push('templateId');
    }
    
    if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey.includes('YOUR_')) {
        missingFields.push('publicKey');
    }
    
    if (missingFields.length > 0) {
        return { 
            valid: false, 
            error: `Missing EmailJS configuration: ${missingFields.join(', ')}` 
        };
    }
    
    return { valid: true };
}
