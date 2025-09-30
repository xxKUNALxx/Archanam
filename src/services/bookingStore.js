// Lightweight client-side booking store with tokenized access link

function generateToken() {
	const rand = Math.random().toString(36).slice(2);
	const time = Date.now().toString(36);
	return `${time}-${rand}`;
}

const KEY = 'archanam_bookings_v1';

function readAll() {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : {};
	} catch (_e) {
		return {};
	}
}

function writeAll(data) {
	localStorage.setItem(KEY, JSON.stringify(data));
	return true;
}

export function createBooking(input) {
	const token = generateToken();
	const all = readAll();
	const now = new Date().toISOString();
	all[token] = { 
		token, 
		createdAt: now, 
		status: 'pending_otp', 
		bookingId: `BK${Date.now()}`,
		...input 
	};
	writeAll(all);
	return all[token];
}

export function getBookingByToken(token) {
	const all = readAll();
	return all[token] || null;
}

export function updateBooking(token, updates) {
	const all = readAll();
	if (!all[token]) return null;
	all[token] = { ...all[token], ...updates };
	writeAll(all);
	return all[token];
}



