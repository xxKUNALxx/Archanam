import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Star, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import NirmalyaPage from './NirmalyaPage';
import PoojaPage from './PoojaPage';
import MalaPage from './MalaPage';
import AIPage, { FloatingPujaChatbot } from './AI';
import AstrologyPage from './AstrologyPage';

// Main Home page image URLs
const homeBgUrl = 'https://plus.unsplash.com/premium_photo-1697730326674-74b6c70509f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const Yagya = 'https://i.pinimg.com/1200x/63/5f/60/635f60ca8b55e2adf8fbc8a94809b150.jpg';
const Pooja = 'https://i.pinimg.com/736x/ec/02/63/ec026397423fd6a9196d9a4f409e013d.jpg';
const Mala = 'https://boondltd.com/wp-content/uploads/2024/01/mixed.png';
const Samgri = 'https://rukminim2.flixcart.com/image/480/480/kgb5rbk0/pooja-thali-set/f/w/v/pooja-thali-nitya-passion-original-imafwkurvma9xd79.jpeg?q=90'
const kundali = 'https://astrotalk.com/astrology-blog/wp-content/uploads/2021/11/online-kundali-janam-kundali.jpeg';
const ai = 'https://img.freepik.com/free-photo/fantasy-scene-depicting-sun-god-s_23-2151339271.jpg';
// Deities for the new section
const vishnu = 'https://i.pinimg.com/736x/23/28/ca/2328ca77dee0527b1fe17f58a8413d35.jpg'
const devi ='https://i.pinimg.com/1200x/e0/89/56/e0895625475ecbe28bc99ea50f256aae.jpg'
const surya='https://i.pinimg.com/736x/96/55/97/96559772e54bf3ed2282b9e1dbc26a03.jpg'
const ganeshaUrl = 'https://static.vecteezy.com/system/resources/previews/069/750/796/non_2x/stone-carved-lord-ganesha-with-golden-aura-free-photo.jpg';
const shivaUrl = 'https://i.pinimg.com/736x/9e/8c/f2/9e8cf28e13396a028717cb3b4884cf83.jpg';

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-[#1B5E20] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/90 to-[#2E7D32]/90 z-0"></div>
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="text-[#FFB300] text-xl animate-pulse">🕉️</div>
                            <h3 className="text-xl font-bold font-serif">अर्चनम्</h3>
                        </div>
                        <p className="text-gray-300">पारंपरिक पूजा और भक्ति सेवाओं के साथ आपके आध्यात्मिक जीवन को समृद्ध करना।</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">सेवाएं</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">घरेलू पूजा</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">व्रत और उपवास</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">त्योहार पूजा</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">जन्मदिन पूजा</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">संपर्क</h4>
                        <div className="space-y-2 text-gray-300">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-[#FFB300]" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-[#FFB300]" />
                                <span>info@bhaktiseva.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-[#FFB300]" />
                                <span>मंगलगिरि, आंध्र प्रदेश</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">हमें फॉलो करें</h4>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFB300] transition-all duration-300 transform hover:scale-110">📘</div>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFB300] transition-all duration-300 transform hover:scale-110">📷</div>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFB300] transition-all duration-300 transform hover:scale-110">🐦</div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>© 2025 अर्चनम्। सर्वाधिकार सुरक्षित।</p>
                </div>
            </div>
        </footer>
    );
};

// Main Home Component
const Home = () => {
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const aboutRef = useRef(null);
    const testimonialsRef = useRef(null);
    const deitiesRef = useRef(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    const handleNavigation = (e, page) => {
        e.preventDefault();
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToBooking = (e) => {
        if (e) e.preventDefault();
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/booking');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger && window.SplitText) {
            window.gsap.registerPlugin(window.ScrollTrigger, window.SplitText);
            if (currentPage === 'home') {
                // Parallax effect on hero background
                window.gsap.to(heroRef.current, {
                    backgroundPosition: '50% 100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
                
                // Hero section animations
                const heroTitle = new window.SplitText(heroRef.current?.querySelector('.hero-title-main'), { type: 'words,chars' });
                window.gsap.from(heroTitle.chars, {
                    opacity: 0,
                    y: 20,
                    rotationX: -90,
                    stagger: 0.05,
                    ease: "power3.out",
                    duration: 1.5,
                    delay: 0.5
                });
                window.gsap.fromTo(heroRef.current?.querySelector('.hero-subtitle'),
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.5 }
                );
                window.gsap.fromTo(heroRef.current?.querySelector('.hero-button'),
                    { scale: 0.8, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)", delay: 2 }
                );
                
                // Scroll-triggered animations for other sections
                const sections = [
                    { ref: servicesRef, selector: '.service-card', direction: 'y' },
                    { ref: aboutRef, selector: '.about-content > *', direction: 'y' },
                    { ref: deitiesRef, selector: '.deity-card', direction: 'scale' },
                    { ref: testimonialsRef, selector: '.testimonial-card', direction: 'x' },
                ];
                
                sections.forEach(section => {
                    const cards = section.ref.current?.querySelectorAll(section.selector);
                    if (cards) {
                        window.gsap.fromTo(cards,
                            section.direction === 'x' 
                                ? { x: -50, opacity: 0 } 
                                : section.direction === 'scale'
                                    ? { scale: 0.8, opacity: 0 }
                                    : { y: 50, opacity: 0 },
                            {
                                x: section.direction === 'x' ? 0 : undefined,
                                y: section.direction === 'y' ? 0 : undefined,
                                scale: section.direction === 'scale' ? 1 : undefined,
                                opacity: 1,
                                duration: 1,
                                stagger: 0.2,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: section.ref.current,
                                    start: "top 80%",
                                    toggleActions: "play none none none"
                                }
                            }
                        );
                    }
                });
                
                // Animation for section titles
                const titles = window.gsap.utils.toArray('.section-title');
                titles.forEach(title => {
                    window.gsap.fromTo(title,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: title,
                                start: "top 90%",
                                toggleActions: "play none none none"
                            }
                        }
                    );
                });
                
                // Floating animation for deities
                const deityCards = window.gsap.utils.toArray('.deity-card');
                deityCards.forEach(card => {
                    window.gsap.to(card, {
                        y: -10,
                        duration: 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "power1.inOut",
                        delay: Math.random() * 0.5
                    });
                });
            }
        }
    }, [currentPage]);
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const renderPage = () => {
        if (currentPage === 'nirmalya') {
            return <NirmalyaPage />;
        }
        if (currentPage === 'mala') {
            return <MalaPage />;
        }
        if (currentPage === 'pooja') {
            return <PoojaPage />;
        }
        if (currentPage === 'ai') {
            return <AIPage />;
        }
        if (currentPage === 'astrology') {
            return <AstrologyPage />;
        }
        return (
            <>
                {/* Hero Section - Home Page with Om signs and Banana Trees */}
                <section ref={heroRef} id="home" className="relative pt-16 sm:pt-20 min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center sm:bg-fixed" style={{ backgroundImage: `url(${homeBgUrl})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 to-[#000000]/40 z-0"></div>
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="w-full h-full relative">
                            {/* Banana trees on both sides */}
                            <img
                                src="/banana.png"
                                alt="Banana Tree Left"
                                className="select-none opacity-80"
                                style={{ position: 'absolute', left: '-120px', bottom: '-20px', height: '75vh', width: 'auto', transformOrigin: 'bottom center', animation: 'sway 5s ease-in-out infinite' }}
                            />
                            <img
                                src="/banana.png"
                                alt="Banana Tree Right"
                                className="select-none opacity-80"
                                style={{ position: 'absolute', right: '-120px', bottom: '-20px', height: '75vh', width: 'auto', transform: 'scaleX(-1)', transformOrigin: 'bottom center', animation: 'sway 5s ease-in-out infinite' }}
                            />
                            
                        </div>
                    </div>
                    <div className="container mx-auto px-4 relative z-20 text-center text-white">
                        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg leading-tight font-serif">
                            <span className="hero-title-main divine-text-shadow">अर्चनम्</span>
                            <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-[#FFB300] mt-2 sm:mt-4 font-semibold">श्रद्धा से सेवा तक - हर पूजा आपके घर तक</div>
                        </h1>
                        <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl mb-4 max-w-3xl mx-auto drop-shadow-md font-devanagari px-4">
                            ॐ सर्वे भवन्तु सुखिनः। सर्वे सन्तु निरामयाः।
                        </p>
                        <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 max-w-3xl mx-auto drop-shadow-md font-devanagari px-4">
                            अपने घर पर पारंपरिक पूजा अनुष्ठानों के साथ दिव्यता का अनुभव करें। हमारी सेवाओं के साथ अपने जीवन में आध्यात्मिक शांति और समृद्धि लाएं।
                        </p>
                        <button onClick={goToBooking} className="hero-button bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-lg sm:text-xl font-bold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl tracking-wide font-devanagari">
                            अभी सेवा बुक करें
                        </button>
                    </div>
                </section>
                
                {/* Services Section */}
                <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-[#F5F5F5] to-[#EEEEEE]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 font-serif">हमारी सेवाएं</h2>
                            <p className="section-title text-base sm:text-lg md:text-xl text-gray-600 font-devanagari">आपकी आध्यात्मिक आवश्यकताओं के लिए विशेष सेवाएं</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                            {/* Pooja Services Card */}
                            <div onClick={(e) => handleNavigation(e, 'pooja')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        <img src={Pooja} alt="Pooja Services" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">पूजा सेवाएं</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">किसी भी अवसर के लिए विभिन्न प्रकार की पूजाएं बुक करें।</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🙏</div>
                                </div>
                            </div>
                            {/* Nirmalya Seva Card */}
                            <div onClick={(e) => handleNavigation(e, 'nirmalya')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={Yagya} alt="Nirmalya Seva" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">निर्माल्य सेवा</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">पूजा अवशेषों का पवित्र और eco-friendly विसर्जन।</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🌿</div>
                                </div>
                            </div>
                            {/* AI Modules Card */}
                            <div onClick={(e) => handleNavigation(e, 'ai')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110">
                                        <img src={ai} alt="AI Modules" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">AI मॉड्यूल</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">AI पूजा सुझाव, मंत्र सहायक, संकल्प, पंचांग</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🤖</div>
                                </div>
                            </div>
                            {/* Daily Flower Mala Service Card */}
                            <div onClick={(e) => handleNavigation(e, 'mala')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={Mala} alt="Daily Flower Mala" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">डेली फूल माला</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">रोज़ ताज़ी माला/फूल आपके घर तक — भक्ति के लिए।</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🌸</div>
                                </div>
                            </div>
                            {/* Daily Puja Materials Card */}
                            <div className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        <img src={Samgri} alt="Daily Puja Materials" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">नित्य पूजन सामग्री</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">दैनिक पूजा के लिए आवश्यक सभी सामग्री उपलब्ध।</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🕯️</div>
                                </div>
                            </div>
                            {/* Astrology Kundali Card */}
                            <div onClick={(e) => handleNavigation(e, 'astrology')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={kundali}  alt="Astrology Kundali" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">ज्योतिष कुंडली</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">व्यक्तिगत कुंडली विश्लेषण और ज्योतिष सलाह।</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🔮</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
                
                {/* About Section */}
                <section ref={aboutRef} id="about" className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="about-content">
                                <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-6 font-serif">हमारे बारे में</h2>
                                <p className="section-title text-lg text-[#424242] mb-6 leading-relaxed font-devanagari">
                                    "अर्चनम्" का संकल्प है आपके जीवन में शांति, सकारात्मकता और दिव्यता लाना।
                                    हमारे अनुभवी पंडितजी पारंपरिक वैदिक विधियों से हर पूजा और अनुष्ठान को पूर्ण श्रद्धा और शुद्धता के साथ सम्पन्न करते हैं।
                                </p>
                                <p className="section-title text-lg text-[#424242] mb-6 leading-relaxed font-devanagari">
                                    आज 500+ संतुष्ट परिवारों और 20+ वर्षों के अनुभव के साथ हम विश्वास और आस्था का सेतु बने हुए हैं।
                                </p>
                                <p className="section-title text-lg text-[#FFB300] mb-6 leading-relaxed font-devanagari italic">
                                    🌸 "आस्था से जुड़ें, संस्कृति को संजोएँ"
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="text-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-4xl text-[#FFB300] mb-2 font-bold font-serif">500+</div>
                                        <div className="text-[#424242] text-lg font-devanagari">प्रसन्न ग्राहक</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-4xl text-[#FFB300] mb-2 font-bold font-serif">20+</div>
                                        <div className="text-[#424242] text-lg font-devanagari">वर्षों का अनुभव</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://i.pinimg.com/736x/d0/08/90/d008903c85b910a67047bdb2450ac013.jpg"
                                            alt="Hindu Temple"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/40 to-transparent"></div>
                                    </div>
                                    <div className="h-40 sm:h-48 md:h-48 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://i.pinimg.com/1200x/a6/97/96/a69796b376475a57668cb0ac789d38d8.jpg"
                                            alt="Lotus flower"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB300]/40 to-transparent"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 sm:space-y-6 sm:mt-0 mt-8">
                                    <div className="h-40 sm:h-48 md:h-48 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://i.pinimg.com/736x/8b/a3/22/8ba322b239ed9a845c7c83abaef61827.jpg"
                                            alt="Prayer beads"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB300]/40 to-transparent"></div>
                                    </div>
                                    <div className="h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://i.pinimg.com/1200x/71/72/3a/71723a56db77c3e1e8d9c6168e50ed8c.jpg"
                                            alt="Hindu ceremony"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/40 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Divine Deities Section */}
                <section ref={deitiesRef} id="deities" className="py-20 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">दिव्य देवता</h2>
                        <p className="section-title text-xl text-[#424242] mb-12 font-devanagari">हमारे समारोहों में जिन देवताओं की हम पूजा करते हैं, उनके बारे में जानें</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
                            {[
                                { name: "भगवान सूर्य", image: surya, desc: "सूर्य देवता जीवन, ऊर्जा और सफलता के दाता हैं।", shloka: "आदित्यस्य नमस्कारान् सर्वे भवन्तु सुखिनः" },
                                { name: "भगवान गणेश", image: ganeshaUrl, desc: "विघ्नहर्ता गणेश जी सभी बाधाओं को दूर करने वाले और नए कार्यों के आरंभकर्ता हैं।", shloka: "गजाननं भूतगणादिसेवितं कपित्थजम्बूफलसारभक्षितम्" },
                                { name: "देवी शक्ति", image: devi, desc: "माँ दुर्गा शक्ति, साहस और रक्षा की देवी हैं।", shloka: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता" },
                                { name: "भगवान शिव", image: shivaUrl, desc: "महादेव शिव संहारकर्ता और कल्याणकारी हैं।", shloka: "कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्" },
                                { name: "भगवान विष्णु", image: vishnu, desc: "विष्णु भगवान पालनकर्ता और धर्म के रक्षक हैं।", shloka: "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम्" }
                            ].map((deity, index) => (
                                <div key={index} className="deity-card group p-6 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                    <div className="w-full h-48 sm:h-52 md:h-56 mx-auto mb-4 overflow-hidden rounded-lg shadow-md transition-all duration-500 group-hover:scale-105 group-hover:saturate-150">
                                        <img src={deity.image} alt={deity.name} className="w-full h-full object-cover bg-gradient-to-br from-gray-50 to-gray-100" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif">{deity.name}</h3>
                                    <p className="text-[#424242] italic mb-2 font-devanagari">{deity.desc}</p>
                                    <p className="text-[#FFB300] text-sm font-sanskrit">{deity.shloka}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Testimonials Section */}
                <section ref={testimonialsRef} className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">ग्राहक प्रतिक्रिया</h2>
                            <p className="section-title text-xl text-[#424242] font-devanagari">हमारे संतुष्ट ग्राहकों से प्रतिक्रिया</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { name: "अनिल भूषण", text: "एक बहुत ही पवित्र और सुंदर पूजा की। घर पर दिव्य उपस्थिति महसूस हुई।", rating: 5 },
                                { name: "एडवोकेट रीता सिंह", text: "त्योहार की पूजा बहुत अच्छी रही। सभी अनुष्ठान बिल्कुल सही ढंग से किए गए।", rating: 5 },
                                { name: "राजीव शुक्ला", text: "समय पर पहुंचे और पूजा बहुत अच्छे से की। धन्यवाद!", rating: 5 },
                                { name: "दिनेश पाठक", text: "निर्माल्य सेवा से घर में सकारात्मक ऊर्जा आई है। बहुत संतुष्ट हूं।", rating: 5 }
                            ].map((testimonial, index) => (
                                <div key={index} className="testimonial-card bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] p-6 rounded-2xl shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-[#FFB300] text-[#FFB300]" />
                                        ))}
                                    </div>
                                    <p className="text-[#424242] mb-4 italic text-base font-devanagari">"{testimonial.text}"</p>
                                    <div className="font-semibold text-[#1B5E20] text-lg">- {testimonial.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Contact Section */}
                <section id="contact" className="py-20 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="section-title text-4xl font-bold mb-4 font-serif">संपर्क करें</h2>
                            <p className="section-title text-xl opacity-90 font-devanagari">आज ही अपनी पूजा बुक करें</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <Phone className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2 font-devanagari">हमें कॉल करें</h3>
                                <p className="opacity-90">+91 98765 43210</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2 font-devanagari">हमें ईमेल करें</h3>
                                <p className="opacity-90">info@bhaktiseva.com</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2 font-devanagari">पता</h3>
                                <p className="opacity-90">मंगलगिरि, आंध्र प्रदेश</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button onClick={goToBooking} className="bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-lg font-devanagari">
                                अभी बुक करें
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button 
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 bg-[#FFB300] text-white p-3 rounded-full shadow-lg z-40 transform transition-all duration-300 hover:bg-[#FFC107] hover:scale-110"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </button>
                )}
            </>
        );
    };
    
    return (
        <div className="min-h-screen bg-white font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
                
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
                @keyframes floatOm {
                    0% { transform: translateY(0px); opacity: 0.2; }
                    25% { transform: translateY(-6px); opacity: 0.6; }
                    50% { transform: translateY(0px); opacity: 0.9; }
                    75% { transform: translateY(6px); opacity: 0.6; }
                    100% { transform: translateY(0px); opacity: 0.2; }
                }
                @keyframes sway {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(2.2deg); }
                }
                
                .divine-text-shadow {
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }
                
                .font-devanagari {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                }
                
                .font-serif {
                    font-family: 'Noto Serif Devanagari', serif;
                }
                
                .font-sanskrit {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                    font-style: italic;
                }
            `}</style>
            <Navbar onNavigate={handleNavigation} />
            {renderPage()}
            <Footer />
            <FloatingPujaChatbot />
            <button 
                onClick={goToBooking}
                className="fixed bottom-8 right-6 bg-[#1B5E20] text-white px-5 py-3 rounded-full shadow-xl z-40 transform transition-all duration-300 hover:bg-[#2E7D32] hover:scale-105"
            >
                📅 Book Puja
            </button>
        </div>
    );
};

export default Home;