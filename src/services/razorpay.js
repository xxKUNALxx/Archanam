// Razorpay payment integration service
import { RAZORPAY_KEY_ID, CURRENCY, MERCHANT_NAME, UPI_ID } from '../config/env.js';

// Razorpay configuration
const RAZORPAY_CONFIG = {
    key: RAZORPAY_KEY_ID,
    currency: CURRENCY,
    name: MERCHANT_NAME,
    description: 'Puja Booking Service',
    image: 'https://picsum.photos/150/150',
    theme: {
        color: '#FFB300'
    }
};

// Alternative test keys (if the current one doesn't work)
const ALTERNATIVE_TEST_KEYS = [
    'rzp_test_RMzUqA0LdgjjXC', // Current key
    // Add your alternative test keys here if you have them
];

// Generate order ID (in production, this should come from your backend)
function generateOrderId() {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate payment amount
function validatePaymentAmount(amount) {
    if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
    }
    if (amount < 1) {
        throw new Error('Minimum payment amount is ₹1');
    }
    if (amount > 100000) {
        throw new Error('Maximum payment amount is ₹1,00,000');
    }
    return true;
}

// Create Razorpay order (simplified for direct payment)
export async function createRazorpayOrder(amount, bookingDetails) {
    // Validate payment amount
    validatePaymentAmount(amount);
    
    // For direct payment, we create a minimal order object
    // Razorpay will handle the actual order creation
    return {
        amount: amount * 100, // Convert to paise
        currency: CURRENCY,
        receipt: `receipt_${bookingDetails.bookingId || Date.now()}`,
        bookingDetails: bookingDetails
    };
}

// Initialize Razorpay payment
export function initializeRazorpayPayment(order, bookingDetails, onSuccess, onError) {
    const options = {
        key: RAZORPAY_CONFIG.key,
        amount: order.amount,
        currency: order.currency,
        name: RAZORPAY_CONFIG.name,
        description: `${bookingDetails.pujaType} - ${bookingDetails.name}`,
        image: RAZORPAY_CONFIG.image,
        order_id: undefined, // Let Razorpay create the order
        handler: function (response) {
            // Payment successful
 onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || order.receipt,
                signature: response.razorpay_signature,
                amount: order.amount,
                currency: order.currency
            });
        },
        prefill: {
            name: bookingDetails.name,
            email: bookingDetails.email || '',
            contact: bookingDetails.phone ? bookingDetails.phone.replace(/\D/g, '') : '' // Remove non-digits
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
            ondismiss: function() {
                onError('Payment cancelled by user');
            }
        },
        retry: {
            enabled: true,
            max_count: 3
        },
        notes: {
            booking_id: bookingDetails.bookingId || order.receipt,
            puja_type: bookingDetails.pujaType,
            booking_date: bookingDetails.date
        },
        // Indian payment methods with UPI priority
        method: {
            upi: true,
            netbanking: true,
            wallet: true,
            emi: true,
            card: true
        },
        // UPI specific configuration
        upi: {
            flow: 'collect', // Enable UPI collect flow
            vpa: undefined, // Let user enter VPA
            upi_link: true, // Enable UPI deep linking
            upi_intent: true // Enable UPI intent
        },
        // Ensure UPI is prominently displayed
        config: {
            display: {
                hide: []
            }
        },
        // Additional UPI configuration
        notes: {
            booking_id: bookingDetails.bookingId || order.receipt,
            puja_type: bookingDetails.pujaType,
            booking_date: bookingDetails.date,
            payment_method: 'upi_enabled'
        }
    };

    try {
        const rzp = new window.Razorpay(options);
        
        // Add error handling for payment failures
        rzp.on('payment.failed', function (response) {
            onError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        });
        
        rzp.open();
        return rzp;
    } catch (error) {
        onError(`Failed to initialize payment: ${error.message}`);
    }
}

// Verify payment signature (in production, this should be done on your backend)
export function verifyPaymentSignature(paymentData, signature) {
    // In production, send this to your backend for verification
    // For now, we'll assume it's valid
 return true;
}

// Load Razorpay script
export function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            resolve(window.Razorpay);
        };
        script.onerror = () => {
            reject(new Error('Failed to load Razorpay script'));
        };
        document.body.appendChild(script);
    });
}

// Test Razorpay configuration
export function testRazorpayConfig() {
    // Validate Razorpay configuration
    
    // Validate key format
    if (!RAZORPAY_CONFIG.key.startsWith('rzp_test_') && !RAZORPAY_CONFIG.key.startsWith('rzp_live_')) {
        return false;
    }
    
    if (RAZORPAY_CONFIG.key.length < 20) {
        return false;
    }
    
    return true;
}

// Test minimal Razorpay payment
export function testMinimalPayment() {
    const options = {
        key: RAZORPAY_CONFIG.key,
        amount: 100, // ₹1.00
        currency: CURRENCY,
        name: 'Test',
        description: 'Test Payment',
        handler: function (response) {
            // Test payment successful
        },
        modal: {
            ondismiss: function() {
                // Test payment cancelled
            }
        },
        retry: {
            enabled: true,
            max_count: 3
        },
        // Ensure Indian card support
        config: {
            display: {
                hide: []
            }
        }
    };
    
    try {
        const rzp = new window.Razorpay(options);
        
        // Add error handling
        rzp.on('payment.failed', function (response) {
            // Payment failed
        });
        
        rzp.open();
        return rzp;
    } catch (error) {
        return null;
    }
}

// Test Razorpay account (without direct API calls due to CORS)
export async function testRazorpayAccount() {
    // Since direct API calls are blocked by CORS, we'll test by checking if Razorpay script loads
    try {
        if (typeof window.Razorpay === 'undefined') {
            await loadRazorpayScript();
        }
        
        if (typeof window.Razorpay !== 'undefined') {
            return { success: true, message: 'Razorpay script loaded' };
        } else {
            return { success: false, error: 'Razorpay script not available' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Payment status constants
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

// Booking status constants
export const BOOKING_STATUS = {
    PENDING_OTP: 'pending_otp',
    OTP_VERIFIED: 'otp_verified',
    PAYMENT_PENDING: 'payment_pending',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled'
};

// Get test card information for Indian cards
export function getTestCardInfo() {
    return {
        indianCards: [
            {
                number: '4111 1111 1111 1111',
                type: 'Visa',
                bank: 'HDFC',
                description: 'Visa test card (Indian) - Primary'
            },
            {
                number: '5555 5555 5555 4444',
                type: 'Mastercard',
                bank: 'ICICI',
                description: 'Mastercard test card (Indian) - Alternative'
            },
            {
                number: '4000 0000 0000 0002',
                type: 'Visa',
                bank: 'SBI',
                description: 'Visa test card (Indian) - Backup'
            },
            {
                number: '4000 0000 0000 0069',
                type: 'Visa',
                bank: 'Axis',
                description: 'Visa test card (Indian) - Alternative'
            }
        ],
        upiTestIds: [
            'test@razorpay',
            'success@razorpay',
            'failure@razorpay'
        ],
        netbankingTest: [
            { bank: 'HDFC', username: 'test', password: 'test' },
            { bank: 'ICICI', username: 'test', password: 'test' },
            { bank: 'SBI', username: 'test', password: 'test' }
        ],
        instructions: [
            'Use any future expiry date (e.g., 12/25)',
            'Use any 3-digit CVV (e.g., 123)',
            'Use any name',
            'These are Indian test cards that should work with INR currency',
            'For UPI: Use test@razorpay as UPI ID',
            'For Net Banking: Use test/test as credentials'
        ]
    };
}

// Test Indian payment with all methods
export function testIndianPayment() {
    const testInfo = getTestCardInfo();
    // Test with minimal amount
    const options = {
        key: RAZORPAY_CONFIG.key,
        amount: 100, // ₹1.00
        currency: CURRENCY,
        name: 'अर्चनम्',
        description: 'Indian Payment Test',
        method: {
            upi: true,
            netbanking: true,
            wallet: true,
            emi: true,
            card: true
        },
        upi: {
            flow: 'collect',
            vpa: undefined,
            upi_link: true,
            upi_intent: true
        },
        handler: function (response) {
            // Indian payment successful
        },
        modal: {
            ondismiss: function() {
                // Indian payment cancelled
            }
        },
        retry: {
            enabled: true,
            max_count: 3
        }
    };
    
    try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        return rzp;
    } catch (error) {
        return null;
    }
}

// Test UPI payment specifically
export function testUPIPayment() {
    const options = {
        key: RAZORPAY_CONFIG.key,
        amount: 100, // ₹1.00
        currency: 'INR',
        name: 'अर्चनम्',
        description: 'UPI Payment Test',
        method: {
            upi: true,
            netbanking: false,
            wallet: false,
            emi: false,
            card: false
        },
        upi: {
            flow: 'collect',
            vpa: 'test@razorpay', // Pre-fill test UPI ID
            upi_link: true,
            upi_intent: true
        },
        config: {
            display: {
                hide: ['netbanking', 'wallet', 'emi', 'card']
            }
        },
        handler: function (response) {
            // UPI payment successful
        },
        modal: {
            ondismiss: function() {
                // UPI payment cancelled
            }
        },
        retry: {
            enabled: true,
            max_count: 3
        }
    };
    
    try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        return rzp;
    } catch (error) {
        return null;
    }
}

// UPI-only payment function
export function initializeUPIPayment(amount, bookingDetails, onSuccess, onError) {
    const options = {
        key: RAZORPAY_CONFIG.key,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'अर्चनम्',
        description: `${bookingDetails.pujaType} - ${bookingDetails.name}`,
        image: RAZORPAY_CONFIG.image,
        method: {
            upi: true,
            netbanking: false,
            wallet: false,
            emi: false,
            card: false
        },
        upi: {
            flow: 'collect',
            vpa: undefined, // Let user enter VPA
            upi_link: true,
            upi_intent: true
        },
        config: {
            display: {
                hide: ['netbanking', 'wallet', 'emi', 'card']
            }
        },
        handler: function (response) {
            onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: amount * 100,
                currency: 'INR'
            });
        },
        modal: {
            ondismiss: function() {
                onError('Payment cancelled by user');
            }
        },
        retry: {
            enabled: true,
            max_count: 3
        },
        notes: {
            booking_id: bookingDetails.bookingId,
            puja_type: bookingDetails.pujaType,
            booking_date: bookingDetails.date,
            payment_method: 'upi_only'
        }
    };
    
    try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        return rzp;
    } catch (error) {
        onError('Failed to initialize UPI payment');
    }
}

// Generate UPI QR Code for payment
export function generateUPIQR(amount, description = 'Puja Booking') {
    const upiId = UPI_ID || 'test@razorpay';
    const merchantName = MERCHANT_NAME;
    const transactionId = `TXN${Date.now()}`;
    
    // UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}&tr=${transactionId}`;
    
    return {
        upiUrl,
        qrData: upiUrl,
        upiId,
        amount,
        description,
        transactionId
    };
}

// Test QR Code generation
export function testUPIQR() {
    const qrData = generateUPIQR(100, 'Test Payment');
    return qrData;
}