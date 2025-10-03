// OTP service with email integration
// Uses EmailJS service for real delivery

import { sendOtpEmail } from './emailOtp.js';

const otpStore = new Map();

function generateOtp() {
	return ('' + Math.floor(100000 + Math.random() * 900000));
}

// Real OTP sending function using email service
async function sendRealOtp(email, otp, language = 'en') {
	try {
		// Send OTP via email service
		const emailResult = await sendOtpEmail(email, otp, language);
		
		console.log(`✅ OTP sent successfully to ${email}`);
		console.log(`📧 Email Provider: ${emailResult.provider}`);
		console.log(`🆔 Message ID: ${emailResult.messageId}`);
		
		return { 
			success: true, 
			messageId: emailResult.messageId,
			provider: emailResult.provider
		};
	} catch (error) {
		console.error(`❌ Failed to send OTP to ${email}:`, error.message);
		throw error;
	}
}

export async function sendOtp(email, language = 'en') {
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw new Error('Invalid email address');
	}
	
	const code = generateOtp();
	const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
	
	try {
		// Send real OTP via email
		const emailResult = await sendRealOtp(email, code, language);
		
		// Store OTP for verification
		otpStore.set(email, { 
			code, 
			expiresAt, 
			attempts: 0,
			sentAt: Date.now(),
			messageId: emailResult.messageId,
			provider: emailResult.provider
		});
		
        return { 
            success: true, 
            expiresAt,
            message: 'OTP sent successfully via email',
            messageId: emailResult.messageId,
            provider: emailResult.provider,
            // Expose OTP only in development for troubleshooting deliverability (Vite/ESM safe)
            debugCode: ((typeof import.meta !== 'undefined') && import.meta.env && import.meta.env.DEV) ? code : undefined
        };
	} catch (error) {
		console.error('OTP sending failed:', error);
		throw new Error(`Failed to send OTP: ${error.message}`);
	}
}

export function verifyOtp(email, code) {
	const rec = otpStore.get(email);
	
	if (!rec) {
		return { success: false, error: 'OTP not requested or expired' };
	}
	
	if (Date.now() > rec.expiresAt) {
		otpStore.delete(email);
		return { success: false, error: 'OTP has expired. Please request a new one.' };
	}
	
	rec.attempts += 1;
	
	if (rec.attempts > 5) {
		otpStore.delete(email);
		return { success: false, error: 'Too many incorrect attempts. Please request a new OTP.' };
	}
	
	if (rec.code !== String(code)) {
		return { 
			success: false, 
			error: `Incorrect OTP. ${5 - rec.attempts} attempts remaining.` 
		};
	}
	
	// OTP verified successfully
	otpStore.delete(email);
	return { 
		success: true, 
		message: 'OTP verified successfully' 
	};
}

// Helper function to check if OTP is still valid
export function isOtpValid(email) {
	const rec = otpStore.get(email);
	return rec && Date.now() <= rec.expiresAt;
}

// Helper function to get remaining time
export function getOtpRemainingTime(email) {
	const rec = otpStore.get(email);
	if (!rec) return 0;
	
	const remaining = Math.max(0, rec.expiresAt - Date.now());
	return Math.ceil(remaining / 1000); // Return seconds
}



