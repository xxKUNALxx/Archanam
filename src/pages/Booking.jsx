import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, User, CheckCircle, ArrowLeft, ArrowRight, CreditCard, Shield, Loader2, QrCode, Smartphone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import { sendOtp, verifyOtp } from '../services/otp';
import { createBooking, updateBooking } from '../services/bookingStore';
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment, BOOKING_STATUS, testRazorpayConfig, testMinimalPayment, testRazorpayAccount, testIndianPayment, getTestCardInfo, testUPIPayment, generateUPIQR, testUPIQR, initializeUPIPayment } from '../services/razorpay';
import { sendBookingConfirmationEmail } from '../services/email';

const Booking = () => {
    const { language } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1); // 1: Selection, 2: OTP, 3: Payment, 4: Success
    
    const handleNavigation = (e, page) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [bookingToken, setBookingToken] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        serviceType: '',
        date: '',
        time: '',
        address: '',
        specialRequests: '',
        otp: '',
        amount: 0
    });

    const [errors, setErrors] = useState({});
    const [showTestInfo, setShowTestInfo] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [showQRGenerator, setShowQRGenerator] = useState(false);

    // Site services with pricing (from pages: MalaPage & NirmalyaPage)
    const services = [
        {
            value: 'daily-flower-mala-monthly',
            label: language === 'hi' ? 'डेली फूल माला (मंथली)' : 'Daily Flower Mala (Monthly)',
            price: 600,
            suggestion: language === 'hi' ? 'रोज़ 1 पूजा माला + ताज़े फूल, डोर-स्टेप डिलीवरी' : '1 mala + fresh flowers daily, doorstep delivery'
        },
        {
            value: 'nirmalya-monthly',
            label: language === 'hi' ? 'निर्माल्य सेवा (मंथली)' : 'Nirmalya Service (Monthly)',
            price: 251,
            suggestion: language === 'hi' ? 'महीना ₹251 — अधिकतम 1.5 किलो तक' : 'Monthly ₹251 — up to 1.5 kg'
        },
        {
            value: 'nirmalya-4months',
            label: language === 'hi' ? 'निर्माल्य 4 महीने' : 'Nirmalya 4 Months',
            price: 751,
            suggestion: language === 'hi' ? '4 महीने की सेवा (बचत ₹253)' : '4 months service (save ₹253)'
        },
        {
            value: 'astrology-kundali',
            label: language === 'hi' ? 'ज्योतिष कुंडली विश्लेषण' : 'Astrology Kundali Analysis',
            price: 251,
            suggestion: language === 'hi'
                ? 'विवाह योग/जीवनसाथी परामर्श • करियर/व्यवसाय/स्वास्थ्य सलाह • ग्रह दशा व उपाय • जीवन समस्याओं का समाधान'
                : 'Marriage prospects & partner consult • Career/Business/Health advice • Planetary periods & remedies • Problem resolution'
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = language === 'hi' ? 'नाम आवश्यक है' : 'Name is required';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = language === 'hi' ? 'फोन नंबर आवश्यक है' : 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = language === 'hi' ? 'वैध फोन नंबर दर्ज करें' : 'Enter valid phone number';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = language === 'hi' ? 'ईमेल आवश्यक है' : 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = language === 'hi' ? 'वैध ईमेल दर्ज करें' : 'Enter valid email address';
        }
        
        if (!formData.serviceType) {
            newErrors.serviceType = language === 'hi' ? 'सेवा का प्रकार चुनें' : 'Select service type';
        }
        
        if (!formData.date) {
            newErrors.date = language === 'hi' ? 'तारीख चुनें' : 'Select date';
        }
        
        if (!formData.time) {
            newErrors.time = language === 'hi' ? 'समय चुनें' : 'Select time';
        }
        
        if (!formData.address.trim()) {
            newErrors.address = language === 'hi' ? 'पता आवश्यक है' : 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        if (!validateStep1()) return;
        
        setLoading(true);
        try {
            const result = await sendOtp(formData.email, language);
            if (result.success) {
                setOtpSent(true);
                setCurrentStep(2);
                // Set amount based on selected service
                const selectedServiceLocal = services.find(s => s.value === formData.serviceType);
                setFormData(prev => ({ ...prev, amount: selectedServiceLocal?.price || 0 }));
                
                // Show success message
                console.log(`✅ OTP sent via ${result.provider} to ${formData.email}`);
            } else {
                setErrors({ email: language === 'hi' ? 'OTP भेजने में त्रुटि' : 'Error sending OTP' });
            }
        } catch (error) {
            console.error('OTP sending error:', error);
            setErrors({ email: error.message || (language === 'hi' ? 'OTP भेजने में त्रुटि' : 'Error sending OTP') });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!formData.otp.trim()) {
            setErrors({ otp: language === 'hi' ? 'OTP दर्ज करें' : 'Enter OTP' });
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtp(formData.email, formData.otp);
            if (result.success) {
                setOtpVerified(true);
                setCurrentStep(3);
                // Create booking record
                const booking = createBooking({
                    ...formData,
                    status: BOOKING_STATUS.OTP_VERIFIED,
                    createdAt: new Date().toISOString()
                });
                setBookingToken(booking.token);
            } else {
                setErrors({ otp: result.error || (language === 'hi' ? 'गलत OTP' : 'Invalid OTP') });
            }
        } catch (error) {
            setErrors({ otp: language === 'hi' ? 'OTP सत्यापन में त्रुटि' : 'OTP verification error' });
        } finally {
            setLoading(false);
        }
    };

    // Test function for debugging Razorpay
    const testRazorpay = async () => {
        console.log('🧪 Testing Razorpay...');
        
        // Test 1: Configuration
        testRazorpayConfig();
        
        // Test 2: Account API
        const accountTest = await testRazorpayAccount();
        console.log('Account test result:', accountTest);
        
        // Test 3: Minimal payment
        if (accountTest.success) {
            testMinimalPayment();
        } else {
            console.error('❌ Account test failed, skipping payment test');
        }
    };

    // Test payment function
    const handleTestPayment = async () => {
        console.log('🧪 Testing Indian Payment...');
        setLoading(true);
        try {
            // Load Razorpay script
            await loadRazorpayScript();
            
            // Test Indian payment
            testIndianPayment();
            
            // Show test card info
            const testInfo = getTestCardInfo();
            console.log('🇮🇳 Test Card Info:', testInfo);
            setShowTestInfo(true);
            
        } catch (error) {
            console.error('❌ Test payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // Test UPI payment function
    const handleTestUPI = async () => {
        console.log('📱 Testing UPI Payment...');
        setLoading(true);
        try {
            await loadRazorpayScript();
            
            // Use UPI-only payment for testing
            initializeUPIPayment(
                1, // ₹1 test amount
                {
                    pujaType: 'Test Puja',
                    name: 'Test User',
                    bookingId: `TEST${Date.now()}`
                },
                (response) => {
                    console.log('✅ UPI test payment successful:', response);
                    setLoading(false);
                },
                (error) => {
                    console.error('❌ UPI test payment failed:', error);
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error('❌ UPI test failed:', error);
            setLoading(false);
        }
    };

    // Generate UPI QR code
    const handleGenerateQR = () => {
        const qrData = generateUPIQR(formData.amount, `${selectedPuja?.label} - ${formData.name}`);
        console.log('📱 Generated UPI QR:', qrData);
        setShowQRGenerator(true);
    };

    // Handle payment method selection
    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        console.log('💳 Payment method selected:', method);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Test Razorpay configuration first
            testRazorpayConfig();
            
            // Load Razorpay script
            await loadRazorpayScript();
            
            // Create order
            const order = await createRazorpayOrder(formData.amount, {
                ...formData,
                bookingId: `BK${Date.now()}`
            });
            
            // Choose payment method
            if (selectedPaymentMethod === 'upi') {
                // Use UPI-only payment
                initializeUPIPayment(
                    formData.amount,
                    formData,
                    async (paymentResponse) => {
                        // Payment successful
                        setPaymentSuccess(true);
                        setCurrentStep(4);
                        
                        // Update booking with payment details
                        const updatedBooking = updateBooking(bookingToken, {
                            status: BOOKING_STATUS.PAYMENT_SUCCESS,
                            paymentId: paymentResponse.paymentId,
                            orderId: paymentResponse.orderId,
                            signature: paymentResponse.signature,
                            amount: paymentResponse.amount,
                            paidAt: new Date().toISOString()
                        });
                        
                        // Send booking confirmation email to host
                        try {
                            await sendBookingConfirmationEmail({
                                ...formData,
                                bookingId: updatedBooking?.bookingId || `BK${Date.now()}`,
                                paymentStatus: 'Payment Successful',
                                amount: formData.amount
                            });
                            console.log('✅ Booking confirmation email sent to host');
                        } catch (emailError) {
                            console.error('❌ Failed to send booking confirmation email:', emailError);
                        }
                        
                        setLoading(false);
                    },
                    (error) => {
                        console.error('❌ UPI payment failed:', error);
                        setLoading(false);
                    }
                );
            } else {
                // Use regular payment (includes all methods)
                initializeRazorpayPayment(
                    order,
                    formData,
                    async (paymentResponse) => {
                        // Payment successful
                        setPaymentSuccess(true);
                        setCurrentStep(4);
                        
                        // Update booking with payment details
                        const updatedBooking = updateBooking(bookingToken, {
                            status: BOOKING_STATUS.PAYMENT_SUCCESS,
                            paymentId: paymentResponse.paymentId,
                            orderId: paymentResponse.orderId,
                            signature: paymentResponse.signature,
                            amount: paymentResponse.amount,
                            paidAt: new Date().toISOString()
                        });
                        
                        // Send booking confirmation email to host
                        try {
                            await sendBookingConfirmationEmail({
                                ...formData,
                                bookingId: updatedBooking?.bookingId || `BK${Date.now()}`,
                                paymentStatus: 'Payment Successful',
                                amount: formData.amount
                            });
                            console.log('✅ Booking confirmation email sent to host');
                        } catch (emailError) {
                            console.error('❌ Failed to send booking confirmation email:', emailError);
                            // Don't fail the booking if email fails
                        }
                        
                        setLoading(false);
                    },
                    (error) => {
                        // Payment failed or cancelled
                        console.error('Payment error:', error);
                        setErrors({ payment: language === 'hi' ? 'भुगतान में त्रुटि' : 'Payment error' });
                        setLoading(false);
                    }
                );
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            setErrors({ payment: language === 'hi' ? 'भुगतान में त्रुटि' : 'Payment error' });
            setLoading(false);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const selectedService = services.find(s => s.value === formData.serviceType);

    // Load Razorpay script on component mount
    useEffect(() => {
        loadRazorpayScript().catch(console.error);
    }, []);

    if (currentStep === 4) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
                <Navbar onNavigate={handleNavigation} />
                <div className="flex items-center justify-center p-4 pt-24">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
                            {language === 'hi' ? 'बुकिंग सफल!' : 'Booking Successful!'}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {language === 'hi' 
                                ? `आपकी ${selectedPuja?.label} सफलतापूर्वक बुक हो गई है।` 
                                : `Your ${selectedPuja?.label} has been successfully booked.`
                            }
                        </p>
                        <p className="text-gray-600 mb-6">
                            {language === 'hi' 
                                ? 'हमारी टीम जल्द ही आपसे संपर्क करेगी।' 
                                : 'Our team will contact you soon.'
                            }
                        </p>
                        <button 
                            onClick={() => window.history.pushState({}, '', '/')}
                            className="bg-[#FFB300] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#FFC107] transition-colors"
                        >
                            {language === 'hi' ? 'वापस होम' : 'Back to Home'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
            <Navbar onNavigate={handleNavigation} />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        currentStep >= step ? 'bg-[#FFB300]' : 'bg-white/20'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-16 h-1 mx-2 ${
                                            currentStep > step ? 'bg-[#FFB300]' : 'bg-white/20'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">
                            {currentStep === 1 && (language === 'hi' ? 'सेवा बुकिंग' : 'Book a Service')}
                            {currentStep === 2 && (language === 'hi' ? 'ईमेल OTP सत्यापन' : 'Email OTP Verification')}
                            {currentStep === 3 && (language === 'hi' ? 'भुगतान' : 'Payment')}
                        </h1>
                        <p className="text-xl text-white/90 font-devanagari">
                            {currentStep === 1 && (language === 'hi' ? 'अपनी आध्यात्मिक यात्रा शुरू करें' : 'Begin your spiritual journey')}
                            {currentStep === 2 && (language === 'hi' ? 'अपने ईमेल में OTP दर्ज करें' : 'Enter OTP from your email')}
                            {currentStep === 3 && (language === 'hi' ? 'सुरक्षित भुगतान करें' : 'Make secure payment')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side - Contact Info or Booking Summary */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
                            {currentStep === 1 && (
                                <>
                                    <h3 className="text-2xl font-bold mb-6 font-serif">
                                        {language === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-[#FFB300]" />
                                            <span>+91 98765 43210</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-[#FFB300]" />
                                            <span>info@bhaktiseva.com</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-5 h-5 text-[#FFB300]" />
                                            <span>{language === 'hi' ? 'मंगलगिरि, आंध्र प्रदेश' : 'Mangalagiri, Andhra Pradesh'}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {(currentStep === 2 || currentStep === 3) && (
                                <>
                                    <h3 className="text-2xl font-bold mb-6 font-serif">
                                        {language === 'hi' ? 'बुकिंग सारांश' : 'Booking Summary'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>{language === 'hi' ? 'नाम:' : 'Name:'}</span>
                                            <span className="font-semibold">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{language === 'hi' ? 'फोन:' : 'Phone:'}</span>
                                            <span className="font-semibold">{formData.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{language === 'hi' ? 'ईमेल:' : 'Email:'}</span>
                                            <span className="font-semibold">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{language === 'hi' ? 'सेवा:' : 'Service:'}</span>
                                            <span className="font-semibold">{selectedService?.label}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{language === 'hi' ? 'तारीख:' : 'Date:'}</span>
                                            <span className="font-semibold">{formData.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{language === 'hi' ? 'समय:' : 'Time:'}</span>
                                            <span className="font-semibold">{formData.time}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-white/20 pt-4">
                                            <span className="text-lg">{language === 'hi' ? 'कुल राशि:' : 'Total Amount:'}</span>
                                            <span className="text-xl font-bold text-[#FFB300]">₹{formData.amount}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Side - Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            {currentStep === 1 && (
                                <form className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'hi' ? 'नाम' : 'Name'} *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder={language === 'hi' ? 'आपका नाम' : 'Your name'}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'hi' ? 'फोन नंबर' : 'Phone Number'} *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="9876543210"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {language === 'hi' ? 'ईमेल' : 'Email'} *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'hi' ? 'सेवा का प्रकार' : 'Type of Service'} *
                                        </label>
                                        <select
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                errors.serviceType ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">{language === 'hi' ? 'चुनें' : 'Select'}</option>
                                            {services.map((svc) => (
                                                <option key={svc.value} value={svc.value}>
                                                    {svc.label} - ₹{svc.price}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                                        {selectedService && (
                                            <p className="text-sm text-gray-600 mt-2 font-devanagari">{selectedService.suggestion}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {language === 'hi' ? 'तारीख' : 'Date'} *
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                    errors.date ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {language === 'hi' ? 'समय' : 'Time'} *
                                            </label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                    errors.time ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'hi' ? 'पता' : 'Address'} *
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder={language === 'hi' ? 'पूरा पता' : 'Complete address'}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'hi' ? 'विशेष अनुरोध' : 'Special Requests'}
                                        </label>
                                        <textarea
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent"
                                            placeholder={language === 'hi' ? 'कोई विशेष आवश्यकता' : 'Any special requirements'}
                                        />
                                    </div>

                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white py-4 rounded-lg font-bold text-lg hover:from-[#FFC107] hover:to-[#FFD54F] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    {language === 'hi' ? 'ईमेल OTP भेजा जा रहा है...' : 'Sending Email OTP...'}
                                                </>
                                            ) : (
                                                <>
                                                    {language === 'hi' ? 'ईमेल OTP भेजें' : 'Send Email OTP'}
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </button>
                                </form>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-[#FFB300] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {language === 'hi' ? 'ईमेल OTP भेजा गया' : 'Email OTP Sent'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {language === 'hi' 
                                                ? `हमने आपके ईमेल ${formData.email} पर OTP भेजा है` 
                                                : `We've sent an OTP to ${formData.email}`
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {language === 'hi' ? 'OTP दर्ज करें' : 'Enter OTP'} *
                                        </label>
                                        <input
                                            type="text"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            maxLength="6"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent text-center text-2xl tracking-widest ${
                                                errors.otp ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="000000"
                                        />
                                        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
                                        >
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            {language === 'hi' ? 'वापस' : 'Back'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white py-3 rounded-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    {language === 'hi' ? 'सत्यापित...' : 'Verifying...'}
                                                </>
                                            ) : (
                                                <>
                                                    {language === 'hi' ? 'सत्यापित करें' : 'Verify'}
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {language === 'hi' ? 'OTP सत्यापित' : 'OTP Verified'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {language === 'hi' ? 'अब सुरक्षित भुगतान करें' : 'Now make secure payment'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-4">
                                            {language === 'hi' ? 'भुगतान विवरण' : 'Payment Details'}
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>{selectedService?.label}</span>
                                                <span>₹{formData.amount}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                                <span>{language === 'hi' ? 'कुल राशि:' : 'Total:'}</span>
                                                <span>₹{formData.amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                        <Shield className="w-4 h-4" />
                                        <span>{language === 'hi' ? 'सुरक्षित भुगतान' : 'Secure Payment'}</span>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-800 mb-3">Choose Payment Method:</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handlePaymentMethodChange('card')}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedPaymentMethod === 'card' 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                                <span className="text-sm font-medium">Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePaymentMethodChange('upi')}
                                                className={`p-3 rounded-lg border-2 transition-colors ${
                                                    selectedPaymentMethod === 'upi' 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <Smartphone className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                                <span className="text-sm font-medium">UPI</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* UPI Options */}
                                    {selectedPaymentMethod === 'upi' && (
                                        <div className="space-y-3 mb-4">
                                            <button
                                                type="button"
                                                onClick={handleTestUPI}
                                                disabled={loading}
                                                className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                                            >
                                                <Smartphone className="w-4 h-4" />
                                                <span>{loading ? 'Testing...' : 'Test UPI Payment'}</span>
                                            </button>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleGenerateQR}
                                                    className="bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                    <span>Generate QR</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Test Button for Debugging */}
                                    <button
                                        type="button"
                                        onClick={handleTestPayment}
                                        disabled={loading}
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors mb-4 disabled:opacity-50"
                                    >
                                        {loading ? '🧪 Testing...' : '🧪 Test All Payment Methods (₹1)'}
                                    </button>

                                    {/* Test Card Information */}
                                    {showTestInfo && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                            <h4 className="font-semibold text-yellow-800 mb-2">🇮🇳 Test Information:</h4>
                                            <div className="text-sm text-yellow-700 space-y-1">
                                                <div><strong>Card:</strong> 4111 1111 1111 1111</div>
                                                <div><strong>Expiry:</strong> 12/25</div>
                                                <div><strong>CVV:</strong> 123</div>
                                                <div><strong>UPI:</strong> test@razorpay</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center"
                                        >
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            {language === 'hi' ? 'वापस' : 'Back'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white py-3 rounded-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    {language === 'hi' ? 'भुगतान...' : 'Processing...'}
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-5 h-5 mr-2" />
                                                    {language === 'hi' ? 'भुगतान करें' : 'Pay Now'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* QR Generator Modal */}
            {showQRGenerator && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <QrCode className="w-6 h-6 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-800">UPI QR Code</h3>
                            </div>
                            <button
                                onClick={() => setShowQRGenerator(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-gray-100 rounded-lg p-8 mb-4">
                                <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                                <p className="text-sm text-gray-600 mt-2">QR Code will be generated here</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-semibold">₹{formData.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">UPI ID:</span>
                                        <span className="font-semibold text-blue-600">test@razorpay</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        // Generate actual QR code
                                        const qrData = generateUPIQR(formData.amount, `${selectedService?.label} - ${formData.name}`);
                                        console.log('Generated QR:', qrData);
                                        alert('QR Code generated! Check console for details.');
                                    }}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    Generate QR Code
                                </button>
                                
                                <button
                                    onClick={() => setShowQRGenerator(false)}
                                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                            
                            <div className="mt-4 text-xs text-gray-500">
                                <p>1. Open any UPI app (PhonePe, Google Pay, Paytm)</p>
                                <p>2. Scan this QR code</p>
                                <p>3. Complete the payment</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;