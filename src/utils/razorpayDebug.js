/**
 * Razorpay Debug Utilities for Production Troubleshooting
 */

import { RAZORPAY_KEY_ID } from '../config/env.js';

/**
 * Debug Razorpay configuration and environment
 */
export function debugRazorpayConfig() {
    const debug = {
        timestamp: new Date().toISOString(),
        environment: {
            isDevelopment: import.meta.env.DEV,
            isProduction: import.meta.env.PROD,
            mode: import.meta.env.MODE,
            baseUrl: import.meta.env.BASE_URL
        },
        razorpayConfig: {
            keyPresent: !!RAZORPAY_KEY_ID,
            keyLength: RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.length : 0,
            keyPrefix: RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.substring(0, 8) + '...' : 'NOT_SET',
            isTestKey: RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.startsWith('rzp_test_') : false,
            isLiveKey: RAZORPAY_KEY_ID ? RAZORPAY_KEY_ID.startsWith('rzp_live_') : false
        },
        browser: {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
            isSecureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
            protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
        },
        razorpayScript: {
            loaded: typeof window !== 'undefined' && !!window.Razorpay,
            version: typeof window !== 'undefined' && window.Razorpay ? 'Available' : 'Not loaded'
        }
    };
    
    return debug;
}

/**
 * Test Razorpay script loading
 */
export async function testRazorpayScriptLoading() {
    try {
        // Check if already loaded
        if (typeof window !== 'undefined' && window.Razorpay) {
            return {
                success: true,
                message: 'Razorpay script already loaded',
                razorpayAvailable: true
            };
        }
        
        // Try to load script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        const loadPromise = new Promise((resolve, reject) => {
            script.onload = () => {
                resolve({
                    success: true,
                    message: 'Razorpay script loaded successfully',
                    razorpayAvailable: !!window.Razorpay
                });
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Razorpay script from CDN'));
            };
            
            // Timeout after 10 seconds
            setTimeout(() => {
                reject(new Error('Razorpay script loading timeout'));
            }, 10000);
        });
        
        document.head.appendChild(script);
        return await loadPromise;
        
    } catch (error) {
        return {
            success: false,
            message: error.message,
            razorpayAvailable: false
        };
    }
}

/**
 * Test Razorpay payment initialization
 */
export function testRazorpayPaymentInit() {
    try {
        if (!window.Razorpay) {
            return {
                success: false,
                error: 'Razorpay script not loaded'
            };
        }
        
        if (!RAZORPAY_KEY_ID) {
            return {
                success: false,
                error: 'Razorpay key not configured'
            };
        }
        
        // Try to create a Razorpay instance (without opening)
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: 100, // ₹1 for testing
            currency: 'INR',
            name: 'Test Payment',
            description: 'Testing Razorpay initialization',
            handler: function(response) {
                // Test handler
            }
        };
        
        const rzp = new window.Razorpay(options);
        
        return {
            success: true,
            message: 'Razorpay payment instance created successfully',
            razorpayInstance: !!rzp
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Comprehensive Razorpay diagnostic
 */
export async function runRazorpayDiagnostic() {
    const diagnostic = {
        timestamp: new Date().toISOString(),
        config: debugRazorpayConfig(),
        scriptTest: null,
        paymentTest: null,
        recommendations: []
    };
    
    // Test script loading
    diagnostic.scriptTest = await testRazorpayScriptLoading();
    
    // Test payment initialization
    diagnostic.paymentTest = testRazorpayPaymentInit();
    
    // Generate recommendations
    if (!diagnostic.config.razorpayConfig.keyPresent) {
        diagnostic.recommendations.push('❌ Razorpay key is missing. Check VITE_RAZORPAY_KEY_ID environment variable.');
    }
    
    if (!diagnostic.config.browser.isSecureContext) {
        diagnostic.recommendations.push('⚠️ Not in secure context (HTTPS). Razorpay requires HTTPS in production.');
    }
    
    if (!diagnostic.scriptTest.success) {
        diagnostic.recommendations.push('❌ Razorpay script failed to load. Check network connectivity and CDN access.');
    }
    
    if (!diagnostic.paymentTest.success) {
        diagnostic.recommendations.push(`❌ Payment initialization failed: ${diagnostic.paymentTest.error}`);
    }
    
    if (diagnostic.config.razorpayConfig.isTestKey && diagnostic.config.environment.isProduction) {
        diagnostic.recommendations.push('⚠️ Using test key in production environment.');
    }
    
    if (diagnostic.recommendations.length === 0) {
        diagnostic.recommendations.push('✅ All checks passed! Razorpay should work correctly.');
    }
    
    return diagnostic;
}

/**
 * Log diagnostic to console (for debugging in browser)
 */
export async function logRazorpayDiagnostic() {
    const diagnostic = await runRazorpayDiagnostic();
    
    console.group('🔍 Razorpay Diagnostic Report');
    console.log('Timestamp:', diagnostic.timestamp);
    console.log('Environment:', diagnostic.config.environment);
    console.log('Razorpay Config:', diagnostic.config.razorpayConfig);
    console.log('Browser Info:', diagnostic.config.browser);
    console.log('Script Test:', diagnostic.scriptTest);
    console.log('Payment Test:', diagnostic.paymentTest);
    console.log('Recommendations:', diagnostic.recommendations);
    console.groupEnd();
    
    return diagnostic;
}