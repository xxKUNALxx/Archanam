// 🧪 Payment Testing Script
// Run this in your browser console to test payments

console.log('🇮🇳 Starting Payment Tests...');

// Test 1: Check Razorpay Configuration
console.log('\n1️⃣ Testing Razorpay Configuration...');
if (typeof testRazorpayConfig === 'function') {
    testRazorpayConfig();
} else {
    console.log('❌ testRazorpayConfig function not found');
}

// Test 2: Test Account Connection
console.log('\n2️⃣ Testing Account Connection...');
if (typeof testRazorpayAccount === 'function') {
    testRazorpayAccount().then(result => {
        console.log('Account test result:', result);
    });
} else {
    console.log('❌ testRazorpayAccount function not found');
}

// Test 3: Get Test Card Information
console.log('\n3️⃣ Getting Test Card Information...');
if (typeof getTestCardInfo === 'function') {
    const testInfo = getTestCardInfo();
    console.log('🇮🇳 Test Cards:', testInfo.indianCards);
    console.log('📱 UPI Test IDs:', testInfo.upiTestIds);
    console.log('🏦 Net Banking Test:', testInfo.netbankingTest);
} else {
    console.log('❌ getTestCardInfo function not found');
}

// Test 4: Test Minimal Payment
console.log('\n4️⃣ Testing Minimal Payment...');
if (typeof testMinimalPayment === 'function') {
    console.log('Click the test button in the payment page to test payment');
} else {
    console.log('❌ testMinimalPayment function not found');
}

// Test 5: Test Indian Payment
console.log('\n5️⃣ Testing Indian Payment...');
if (typeof testIndianPayment === 'function') {
    console.log('Click the "Test Indian Payment" button in the payment page');
} else {
    console.log('❌ testIndianPayment function not found');
}

console.log('\n✅ Payment tests completed!');
console.log('📋 Next steps:');
console.log('1. Go to your booking page');
console.log('2. Fill in the form and reach payment step');
console.log('3. Click "Test Indian Payment (₹1)" button');
console.log('4. Use test card: 4111 1111 1111 1111');
console.log('5. Expiry: 12/25, CVV: 123');

