// Telegram Bot integration for sending booking notifications

// Telegram Bot configuration
const TELEGRAM_CONFIG = {
    // Your bot token from BotFather
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
    // Your chat ID (you'll get this after sending /start to your bot)
    chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID,
    // Telegram Bot API endpoint
    apiUrl: 'https://api.telegram.org/bot'
};

// Format booking details for Telegram message
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

    // Convert amount from paise to rupees (Razorpay stores in paise)
    const amountInRupees = Math.round(amount / 100);

    let message = `🕉️ *नई बुकिंग - अर्चनम्*\n\n`;
    message += `📋 *बुकिंग विवरण:*\n`;
    message += `• बुकिंग ID: \`${bookingId}\`\n`;
    message += `• सेवा: ${serviceName}\n`;
    message += `• राशि: ₹${amountInRupees}\n`;
    message += `• भुगतान ID: \`${paymentId}\`\n\n`;
    
    message += `👤 *ग्राहक विवरण:*\n`;
    message += `• नाम: ${name}\n`;
    message += `• फोन: \`${phone}\`\n`;
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

// Send Telegram message using Bot API
export const sendTelegramMessage = async (bookingData) => {
    try {
        // Check if Telegram is configured
        if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) {
            return { success: false, error: 'Telegram not configured' };
        }

        // Format the booking message
        const message = formatBookingMessage(bookingData);
        
        // Telegram Bot API endpoint
        const url = `${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        const payload = {
            chat_id: TELEGRAM_CONFIG.chatId,
            text: message,
            parse_mode: 'Markdown'
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            return { success: true, messageId: result.result.message_id };
        } else {
            return { success: false, error: result.description || 'Failed to send Telegram message' };
        }

    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Test Telegram bot connection
export const testTelegramConnection = async () => {
    try {
        // Check configuration
        if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId) {
            return { success: false, error: 'Telegram not configured' };
        }
        
        // Test with simple message
        const testMessage = '🧪 *Test message from अर्चनम्*\n\nTelegram integration is working! 🎉';
        
        const url = `${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        const payload = {
            chat_id: TELEGRAM_CONFIG.chatId,
            text: testMessage,
            parse_mode: 'Markdown'
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (response.ok && result.ok) {
            return { success: true, messageId: result.result.message_id };
        } else {
            return { success: false, error: result.description || 'Telegram test failed' };
        }
        
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get your chat ID (call this function and check the response)
export const getChatId = async () => {
    try {
        if (!TELEGRAM_CONFIG.botToken) {
            return { success: false, error: 'Bot token not configured' };
        }
        
        const url = `${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/getUpdates`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (response.ok && result.ok) {
            return { success: true, updates: result.result };
        } else {
            return { success: false, error: 'Failed to get updates' };
        }
        
    } catch (error) {
        return { success: false, error: error.message };
    }
};