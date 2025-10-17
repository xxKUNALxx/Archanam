import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, User, CheckCircle, ArrowLeft, ArrowRight, CreditCard, Shield, Loader2, QrCode, Smartphone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import Navbar from '../components/Navbar';
import { createBooking, updateBooking } from '../services/bookingStore';
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment, BOOKING_STATUS } from '../services/razorpay';
import { sendWhatsAppMessage, sendCustomerConfirmation } from '../services/whatsapp';

const Booking = () => {
    const { language } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1); // 1: Selection, 2: Payment, 3: Success
    
    const handleNavigation = (e, page) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };
    const [loading, setLoading] = useState(false);
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
        amount: 0,
        // Birth details for Kundali service
        dateOfBirth: '',
        birthTime: '',
        birthPeriod: 'AM',
        birthPlace: ''
    });

    const [errors, setErrors] = useState({});

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
            newErrors.serviceType = t('booking.serviceRequired', language);
        }
        
        if (!formData.date) {
            newErrors.date = t('booking.dateRequired', language);
        }
        
        if (!formData.time) {
            newErrors.time = t('booking.timeRequired', language);
        }
        
        if (!formData.address.trim()) {
            newErrors.address = t('booking.addressRequired', language);
        }

        // Birth details validation for Kundali service
        if (formData.serviceType === 'astrology-kundali') {
            if (!formData.dateOfBirth) {
                newErrors.dateOfBirth = language === 'hi' ? 'जन्म तिथि आवश्यक है' : 'Date of birth is required';
            } else {
                const birthDate = new Date(formData.dateOfBirth);
                const today = new Date();
                if (birthDate > today) {
                    newErrors.dateOfBirth = language === 'hi' ? 'जन्म तिथि भविष्य में नहीं हो सकती' : 'Birth date cannot be in future';
                }
            }
            
            if (!formData.birthTime) {
                newErrors.birthTime = language === 'hi' ? 'जन्म समय आवश्यक है' : 'Birth time is required';
            }
            
            if (!formData.birthPlace.trim()) {
                newErrors.birthPlace = language === 'hi' ? 'जन्म स्थान आवश्यक है' : 'Birth place is required';
            } else if (formData.birthPlace.trim().length < 2) {
                newErrors.birthPlace = language === 'hi' ? 'वैध जन्म स्थान दर्ज करें' : 'Enter valid birth place';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProceedToPayment = async () => {
        if (!validateStep1()) return;
        
        setLoading(true);
        try {
            // Set amount based on selected service
            const selectedServiceLocal = services.find(s => s.value === formData.serviceType);
            const updatedFormData = { ...formData, amount: selectedServiceLocal?.price || 0 };
            setFormData(updatedFormData);
            
            // Create booking record directly (no OTP verification needed)
            const booking = createBooking({
                ...updatedFormData,
                status: BOOKING_STATUS.PAYMENT_PENDING,
                createdAt: new Date().toISOString()
            });
            setBookingToken(booking.token);
            
            // Proceed to payment step
            setCurrentStep(2);

        } catch (error) {
            setErrors({ general: language === 'hi' ? 'बुकिंग बनाने में त्रुटि' : 'Error creating booking' });
        } finally {
            setLoading(false);
        }
    };

    // Test functions removed for production

    // Generate UPI QR code
    const handleGenerateQR = () => {
        const qrData = generateUPIQR(formData.amount, `${selectedPuja?.label} - ${formData.name}`);

        setShowQRGenerator(true);
    };

    // Handle payment method selection
    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);

    };

    const handlePayment = async () => {
        setLoading(true);
        try {
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
                        setCurrentStep(3);
                        
                        // Update booking with payment details
                        const updatedBooking = updateBooking(bookingToken, {
                            status: BOOKING_STATUS.PAYMENT_SUCCESS,
                            paymentId: paymentResponse.paymentId,
                            orderId: paymentResponse.orderId,
                            signature: paymentResponse.signature,
                            amount: paymentResponse.amount,
                            paidAt: new Date().toISOString()
                        });
                        
                        // Send WhatsApp notification to admin
                        try {
 const whatsappResult = await sendWhatsAppMessage({
                                ...formData,
                                bookingId: updatedBooking.bookingId,
                                paymentId: paymentResponse.paymentId,
                                amount: paymentResponse.amount
                            });
                            
                            if (whatsappResult.success) {
                            } else {
                            }
                            
                            // Optional: Send confirmation to customer
                            const customerConfirmation = await sendCustomerConfirmation(
                                formData.phone, 
                                {
                                    ...formData,
                                    bookingId: updatedBooking.bookingId,
                                    amount: paymentResponse.amount
                                }
                            );
                            
                            if (customerConfirmation.success) {
                            } else {
                            }
                            
                        } catch (whatsappError) {
                            // Don't fail the booking if WhatsApp fails
                        }
                        
                        setLoading(false);
                    },
                    (error) => {
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
                        setCurrentStep(3);
                        
                        // Update booking with payment details
                        const updatedBooking = updateBooking(bookingToken, {
                            status: BOOKING_STATUS.PAYMENT_SUCCESS,
                            paymentId: paymentResponse.paymentId,
                            orderId: paymentResponse.orderId,
                            signature: paymentResponse.signature,
                            amount: paymentResponse.amount,
                            paidAt: new Date().toISOString()
                        });
                        
                        // Send WhatsApp notification to admin
                        try {
 const whatsappResult = await sendWhatsAppMessage({
                                ...formData,
                                bookingId: updatedBooking.bookingId,
                                paymentId: paymentResponse.paymentId,
                                amount: paymentResponse.amount
                            });
                            
                            if (whatsappResult.success) {
                            } else {
                            }
                            
                            // Optional: Send confirmation to customer
                            const customerConfirmation = await sendCustomerConfirmation(
                                formData.phone, 
                                {
                                    ...formData,
                                    bookingId: updatedBooking.bookingId,
                                    amount: paymentResponse.amount
                                }
                            );
                            
                            if (customerConfirmation.success) {
                            } else {
                            }
                            
                        } catch (whatsappError) {
                            // Don't fail the booking if WhatsApp fails
                        }
                        
                        setLoading(false);
                    },
                    (error) => {
                        // Payment failed or cancelled
                        setErrors({ payment: language === 'hi' ? 'भुगतान में त्रुटि' : 'Payment error' });
                        setLoading(false);
                    }
                );
            }
        } catch (error) {
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

    // WhatsApp test function removed for production

    // Load Razorpay script on component mount
    useEffect(() => {
        loadRazorpayScript().catch(console.error);
    }, []);

    if (currentStep === 3) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1B5E20] to-[#2E7D32]">
                <Navbar onNavigate={handleNavigation} />
                <div className="flex items-center justify-center p-4 pt-24">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
                            {t('booking.successTitle', language)}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {language === 'hi' 
                                ? `आपकी सेवा सफलतापूर्वक बुक हो गई है।` 
                                : `Your service has been successfully booked.`
                            }
                        </p>
                        {formData.serviceType && (
                            <p className="text-sm text-gray-500 mb-4">
                                {language === 'hi' ? 'सेवा:' : 'Service:'} {formData.serviceType}
                            </p>
                        )}
                        <p className="text-gray-600 mb-6">
                            {language === 'hi' 
                                ? 'हमारी टीम जल्द ही आपसे संपर्क करेगी।' 
                                : 'Our team will contact you soon.'
                            }
                        </p>
                        <button 
                            onClick={handleNavigation}
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
                            {[1, 2].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        currentStep >= step ? 'bg-[#FFB300]' : 'bg-white/20'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 2 && (
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
                            {currentStep === 1 && t('booking.title', language)}
                            {currentStep === 2 && t('booking.paymentTitle', language)}
                        </h1>
                        <p className="text-xl text-white/90 font-devanagari">
                            {currentStep === 1 && t('booking.subtitle', language)}
                            {currentStep === 2 && t('booking.paymentSubtitle', language)}
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
                            
                            {currentStep === 2 && (
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
                                        
                                        {/* Birth Details for Kundali Service */}
                                        {formData.serviceType === 'astrology-kundali' && formData.dateOfBirth && (
                                            <>
                                                <div className="border-t border-white/20 pt-4">
                                                    <h4 className="text-sm font-semibold text-[#FFB300] mb-2">
                                                        {language === 'hi' ? 'जन्म विवरण:' : 'Birth Details:'}
                                                    </h4>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>{language === 'hi' ? 'जन्म तिथि:' : 'Birth Date:'}</span>
                                                    <span className="font-semibold">{formData.dateOfBirth}</span>
                                                </div>
                                                {formData.birthTime && (
                                                    <div className="flex justify-between">
                                                        <span>{language === 'hi' ? 'जन्म समय:' : 'Birth Time:'}</span>
                                                        <span className="font-semibold">{formData.birthTime} {formData.birthPeriod}</span>
                                                    </div>
                                                )}
                                                {formData.birthPlace && (
                                                    <div className="flex justify-between">
                                                        <span>{language === 'hi' ? 'जन्म स्थान:' : 'Birth Place:'}</span>
                                                        <span className="font-semibold">{formData.birthPlace}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        
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
                                            {t('booking.name', language)} *
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
                                            {t('booking.phone', language)} *
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
                                        {t('booking.email', language)} *
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
                                            {t('booking.serviceType', language)} *
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

                                    {/* Birth Details for Kundali Service */}
                                    {formData.serviceType === 'astrology-kundali' && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
                                            <h4 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                                                <span className="mr-2">🕉️</span>
                                                {language === 'hi' ? 'जन्म विवरण (कुंडली के लिए आवश्यक)' : 'Birth Details (Required for Kundali)'}
                                            </h4>
                                            
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'} *
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        {language === 'hi' ? 'जन्म समय' : 'Birth Time'} *
                                                    </label>
                                                    <input
                                                        type="time"
                                                        name="birthTime"
                                                        value={formData.birthTime}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                            errors.birthTime ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {errors.birthTime && <p className="text-red-500 text-sm mt-1">{errors.birthTime}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        {language === 'hi' ? 'AM/PM' : 'AM/PM'} *
                                                    </label>
                                                    <select
                                                        name="birthPeriod"
                                                        value={formData.birthPeriod}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                            errors.birthPeriod ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    >
                                                        <option value="AM">AM</option>
                                                        <option value="PM">PM</option>
                                                    </select>
                                                    {errors.birthPeriod && <p className="text-red-500 text-sm mt-1">{errors.birthPeriod}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    {language === 'hi' ? 'जन्म स्थान' : 'Birth Place'} *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="birthPlace"
                                                    value={formData.birthPlace}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-transparent ${
                                                        errors.birthPlace ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder={language === 'hi' ? 'जैसे: मुंबई, महाराष्ट्र' : 'e.g: Mumbai, Maharashtra'}
                                                />
                                                {errors.birthPlace && <p className="text-red-500 text-sm mt-1">{errors.birthPlace}</p>}
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                                <p className="text-sm text-blue-800">
                                                    <strong>{language === 'hi' ? 'महत्वपूर्ण:' : 'Important:'}</strong>
                                                    {language === 'hi' 
                                                        ? ' सटीक कुंडली विश्लेषण के लिए जन्म का सही समय और स्थान बहुत आवश्यक है।'
                                                        : ' Accurate birth time and place are essential for precise Kundali analysis.'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {t('booking.date', language)} *
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
                                                {t('booking.time', language)} *
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
                                            {t('booking.address', language)} *
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
                                            {t('booking.specialRequests', language)}
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
                                            onClick={handleProceedToPayment}
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white py-4 rounded-lg font-bold text-lg hover:from-[#FFC107] hover:to-[#FFD54F] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    {language === 'hi' ? 'भुगतान के लिए आगे बढ़ रहे हैं...' : 'Proceeding to Payment...'}
                                                </>
                                            ) : (
                                                <>
                                                    {language === 'hi' ? 'भुगतान के लिए आगे बढ़ें' : 'Proceed to Payment'}
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </button>
                                </form>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {language === 'hi' ? 'सुरक्षित भुगतान' : 'Secure Payment'}
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