// WhatsApp Business API integration for sending booking details

// WhatsApp Business API configuration
const WHATSAPP_CONFIG = {
    // Your WhatsApp Business API credentials from Meta Developer
    phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID,
    accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN,
    apiVersion: 'v18.0',
    recipientNumber: import.meta.env.VITE_WHATSAPP_RECIPIENT_NUMBER, // Your WhatsApp number to receive messages
};

// WhatsApp Business API endpoint
const getWhatsAppApiUrl = () => {
    return `https://graph.facebook.com/${WHATSAPP_CONFIG.apiVersion}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
};

// Format booking details for WhatsApp message
const formatBookingMessage = (bookingData) => {
    const { 
        name, 
        phone, 
        email, 
        serviceType, 
        date, 
        time, 
        address, 
        amount, 
        bookingId,
        paymentId,
        specialRequests,
        // Birth details for Kundali
        dateOfBirth,
        birthTime,
        birthPeriod,
        birthPlace
    } = bookingData;

    // Get service name
    const services = {
        'daily-flower-mala-monthly': 'डेली फूल माला (मंथली)',
        'nirmalya-monthly': 'निर्माल्य सेवा (मंथली)',
        'nirmalya-4months': 'निर्माल्य 4 महीने',
        'astrology-kundali': 'ज्योतिष कुंडली विश्लेषण'
    };

    const serviceName = services[serviceType] || serviceType;

    let message = `🕉️ *नई बुकिंग - अर्चनम्*\n\n`;
    message += `📋 *बुकिंग विवरण:*\n`;
    message += `• बुकिंग ID: ${bookingId}\n`;
    message += `• सेवा: ${serviceName}\n`;
    message += `• राशि: ₹${amount}\n`;
    message += `• भुगतान ID: ${paymentId}\n\n`;
    
    message += `👤 *ग्राहक विवरण:*\n`;
    message += `• नाम: ${name}\n`;
    message += `• फोन: ${phone}\n`;
    message += `• ईमेल: ${email}\n`;
    message += `• पता: ${address}\n\n`;
    
    message += `📅 *सेवा विवरण:*\n`;
    message += `• तारीख: ${date}\n`;
    message += `• समय: ${time}\n`;

    // Add birth details for Kundali service
    if (serviceType === 'astrology-kundali' && dateOfBirth) {
        message += `\n🌟 *जन्म विवरण (कुंडली के लिए):*\n`;
        message += `• जन्म तिथि: ${dateOfBirth}\n`;
        if (birthTime) {
            message += `• जन्म समय: ${birthTime} ${birthPeriod}\n`;
        }
        if (birthPlace) {
            message += `• जन्म स्थान: ${birthPlace}\n`;
        }
    }

    if (specialRequests) {
        message += `\n📝 *विशेष अनुरोध:*\n${specialRequests}\n`;
    }

    message += `\n⏰ *बुकिंग समय:* ${new Date().toLocaleString('hi-IN')}\n`;
    message += `\n✅ *स्थिति:* भुगतान सफल`;

    return message;
};

// Send WhatsApp message using Meta Business API
export const sendWhatsAppMessage = async (bookingData) => {
    try {

        // Check if WhatsApp is configured
        if (!WHATSAPP_CONFIG.phoneNumberId || !WHATSAPP_CONFIG.accessToken || !WHATSAPP_CONFIG.recipientNumber) {
            return { success: false, error: 'WhatsApp not configured' };
        }

        const message = formatBookingMessage(bookingData);
        
        // Use custom booking confirmation template
        const payload = {
            messaging_product: "whatsapp",
            to: WHATSAPP_CONFIG.recipientNumber,
            type: "template",
            template: {
                name: "booking_confirmation",
                language: {
                    code: "en" // English language code as per your template
                },
                components: [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: bookingData.name || 'ग्राहक' },                    // {{1}} - Name
                            { type: "text", text: bookingData.bookingId || 'N/A' },                // {{2}} - Booking ID
                            { type: "text", text: bookingData.phone || 'N/A' },                    // {{3}} - Phone
                            { type: "text", text: bookingData.email || 'N/A' },                    // {{4}} - Email
                            { type: "text", text: bookingData.serviceType || 'सेवा' },             // {{5}} - Service
                            { type: "text", text: bookingData.date || 'N/A' },                     // {{6}} - Date
                            { type: "text", text: bookingData.time || 'N/A' },                     // {{7}} - Time
                            { type: "text", text: bookingData.address || 'N/A' },                  // {{8}} - Address
                            { type: "text", text: bookingData.amount?.toString() || '0' },         // {{9}} - Amount
                            { type: "text", text: bookingData.paymentId || 'N/A' },               // {{10}} - Payment ID
                            { type: "text", text: bookingData.specialRequests || 'कोई विशेष अनुरोध नहीं' } // {{11}} - Special requests
                        ]
                    }
                ]
            }
        };

        const response = await fetch(getWhatsAppApiUrl(), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, messageId: result.messages?.[0]?.id };
        } else {
            return { success: false, error: result.error?.message || 'Failed to send message' };
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Send confirmation message to customer (optional)
export const sendCustomerConfirmation = async (customerPhone, bookingData) => {
    try {

        if (!WHATSAPP_CONFIG.phoneNumberId || !WHATSAPP_CONFIG.accessToken) {
            return { success: false, error: 'WhatsApp not configured' };
        }

        const services = {
            'daily-flower-mala-monthly': 'डेली फूल माला (मंथली)',
            'nirmalya-monthly': 'निर्माल्य सेवा (मंथली)',
            'nirmalya-4months': 'निर्माल्य 4 महीने',
            'astrology-kundali': 'ज्योतिष कुंडली विश्लेषण'
        };

        const serviceName = services[bookingData.serviceType] || bookingData.serviceType;

        let message = `🕉️ *अर्चनम् - बुकिंग पुष्टि*\n\n`;
        message += `नमस्ते ${bookingData.name} जी,\n\n`;
        message += `आपकी बुकिंग सफलतापूर्वक पूर्ण हो गई है!\n\n`;
        message += `📋 *विवरण:*\n`;
        message += `• सेवा: ${serviceName}\n`;
        message += `• बुकिंग ID: ${bookingData.bookingId}\n`;
        message += `• तारीख: ${bookingData.date}\n`;
        message += `• समय: ${bookingData.time}\n`;
        message += `• राशि: ₹${bookingData.amount}\n\n`;
        message += `हमारी टीम जल्द ही आपसे संपर्क करेगी।\n\n`;
        message += `धन्यवाद! 🙏\n`;
        message += `*अर्चनम् टीम*`;

        const payload = {
            messaging_product: "whatsapp",
            to: customerPhone,
            type: "text",
            text: {
                body: message
            }
        };

        const response = await fetch(getWhatsAppApiUrl(), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, messageId: result.messages?.[0]?.id };
        } else {
            return { success: false, error: result.error?.message || 'Failed to send confirmation' };
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
};

// WhatsApp test functions removed for production