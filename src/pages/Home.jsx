import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Star, ArrowUp, Facebook, Instagram, Youtube } from 'lucide-react';
import Navbar from '../components/Navbar';
import NirmalyaPage from './NirmalyaPage';
import PoojaPage from './PoojaPage';
import MalaPage from './MalaPage';
import AIPage, { FloatingPujaChatbot } from './AI';
import AstrologyPage from './AstrologyPage';
import { useLanguage } from '../context/LanguageContext';
import { t, translations } from '../utils/translations';
import { PanchangWidget } from '../components/PanchangWidget';

// Main Home page image URLs
const homeBgUrl = '/mandir.png';
const Yagya = 'https://i.pinimg.com/1200x/63/5f/60/635f60ca8b55e2adf8fbc8a94809b150.jpg';
const Pooja = 'https://i.pinimg.com/736x/ec/02/63/ec026397423fd6a9196d9a4f409e013d.jpg';
const Mala = 'https://boondltd.com/wp-content/uploads/2024/01/mixed.png';
const Samgri = 'https://rukminim2.flixcart.com/image/480/480/kgb5rbk0/pooja-thali-set/f/w/v/pooja-thali-nitya-passion-original-imafwkurvma9xd79.jpeg?q=90'
const kundali = 'https://astrotalk.com/astrology-blog/wp-content/uploads/2021/11/online-kundali-janam-kundali.jpeg';
const ai = 'https://img.freepik.com/free-photo/fantasy-scene-depicting-sun-god-s_23-2151339271.jpg';
// Deities for the new section
const vishnu = 'https://i.pinimg.com/736x/23/28/ca/2328ca77dee0527b1fe17f58a8413d35.jpg'
const devi = 'https://i.pinimg.com/1200x/e0/89/56/e0895625475ecbe28bc99ea50f256aae.jpg'
const surya = 'https://i.pinimg.com/736x/96/55/97/96559772e54bf3ed2282b9e1dbc26a03.jpg'
const ganeshaUrl = 'https://static.vecteezy.com/system/resources/previews/069/750/796/non_2x/stone-carved-lord-ganesha-with-golden-aura-free-photo.jpg';
const shivaUrl = 'https://i.pinimg.com/736x/9e/8c/f2/9e8cf28e13396a028717cb3b4884cf83.jpg';

// Footer Component
const Footer = () => {
    const { language } = useLanguage();

    return (
        <footer className="bg-[#1B5E20] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/90 to-[#2E7D32]/90 z-0"></div>
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="text-[#FFB300] text-xl animate-pulse">🕉️</div>
                            <h3 className="text-xl font-bold font-serif">{t('home.title', language)}</h3>
                        </div>
                        <p className="text-gray-300">{t('home.footerDesc', language)}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">{t('home.footerServices', language)}</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">{t('home.homePooja', language)}</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">{t('home.fasting', language)}</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">{t('home.festivalPooja', language)}</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">{t('home.birthdayPooja', language)}</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">{t('home.footerContact', language)}</h4>
                        <div className="space-y-2 text-gray-300">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-[#FFB300]" />
                                <span>+91 9458090609</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-[#FFB300]" />
                                <span>help.archnam@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-[#FFB300]" />
                                <span>मुज़फ़्फरनगर, उत्तर प्रदेश</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">{t('home.followUs', language)}</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/share/16X1DQnvMZ/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1877F2] transition-all duration-300 transform hover:scale-110">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                            <a href="https://www.instagram.com/archnam108?igsh=bjU2YjVtczg2eG00" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gradient-to-r hover:from-[#E4405F] hover:to-[#F56040] transition-all duration-300 transform hover:scale-110">
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                            <a href="https://youtube.com/@archnam-n8c?si=xy1KwaUpwA5oh5kA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110">
                                <Youtube className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 mb-4">
                        <a
                            href="/privacy-policy"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/privacy-policy');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="hover:text-[#FFB300] transition-colors cursor-pointer font-devanagari"
                        >
                            {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                        </a>
                        <span className="hidden md:inline">|</span>
                        <a
                            href="/terms"
                            className="hover:text-[#FFB300] transition-colors cursor-pointer font-devanagari"
                        >
                            {language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}
                        </a>
                    </div>
                    <p>© 2025 अर्चनम्। सर्वाधिकार सुरक्षित।</p>
                </div>
            </div>
        </footer>
    );
};

// Main Home Component
const Home = () => {
    const { language } = useLanguage();
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const aboutRef = useRef(null);
    const testimonialsRef = useRef(null);
    const deitiesRef = useRef(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleNavigation = (e, page, section = null) => {
        e.preventDefault();

        // If navigating to a different page, change page and scroll to top
        if (page !== 'home') {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // If already on home page or navigating to home, handle section scrolling
        if (currentPage !== 'home') {
            setCurrentPage('home');
            // Wait for page to render before scrolling to section
            setTimeout(() => {
                if (section) {
                    scrollToSection(section);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Already on home page, just scroll to section
            if (section) {
                scrollToSection(section);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const scrollToSection = (section) => {
        const sectionRefs = {
            'about': aboutRef,
            'contact': document.querySelector('#contact'),
            'services': servicesRef,
            'deities': deitiesRef,
            'testimonials': testimonialsRef
        };

        if (section === 'contact') {
            // For contact section, scroll to the contact section element
            const contactElement = document.querySelector('#contact');
            if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else if (sectionRefs[section] && sectionRefs[section].current) {
            sectionRefs[section].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
                {/* Hero Section - Home Page */}
                <section ref={heroRef} id="home" className="relative pt-16 sm:pt-20 min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center sm:bg-fixed" style={{ backgroundImage: `url(${homeBgUrl})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 to-[#000000]/40 z-0"></div>
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="w-full h-full relative">
                            {/* Decorative layer intentionally left blank */}
                        </div>
                    </div>
                    <div className="container mx-auto px-4 relative z-20 text-center text-white">
                        <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg leading-tight font-serif">
                            <span className="hero-title-main divine-text-shadow">{t('home.title', language)}</span>
                            <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-[#FFB300] mt-2 sm:mt-4 font-semibold">{t('home.subtitle', language)}</div>
                        </h1>
                        <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl mb-4 max-w-3xl mx-auto drop-shadow-md font-devanagari px-4">
                            {language === 'hi' ? 'ॐ सर्वे भवन्तु सुखिनः। सर्वे सन्तु निरामयाः।' : 'Om Sarve Bhavantu Sukhinah. Sarve Santu Niramayah.'}
                        </p>
                        <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 max-w-3xl mx-auto drop-shadow-md font-devanagari px-4">
                            {t('home.description', language)}
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
                            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B5E20] mb-4 font-serif">{t('home.servicesTitle', language)}</h2>
                            <p className="section-title text-base sm:text-lg md:text-xl text-gray-600 font-devanagari">{t('home.servicesSubtitle', language)}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                            {/* Pooja Services Card */}
                            <div onClick={(e) => handleNavigation(e, 'pooja')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        <img src={Pooja} alt="Pooja Services" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">{t('home.poojaTitle', language)}</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">{t('home.poojaDesc', language)}</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🙏</div>
                                </div>
                            </div>
                            {/* Nirmalya Seva Card */}
                            <div onClick={(e) => handleNavigation(e, 'nirmalya')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={Yagya} alt="Nirmalya Seva" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">{t('navbar.nirmalya', language)}</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">{language === 'hi' ? 'पूजा अवशेषों का पवित्र और eco-friendly विसर्जन।' : 'Sacred and eco-friendly disposal of pooja remains.'}</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🌿</div>
                                </div>
                            </div>
                            {/* AI Modules Card */}
                            <div onClick={(e) => handleNavigation(e, 'ai')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110">
                                        <img src={ai} alt="AI Modules" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">{t('home.aiTitle', language)}</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">{t('home.aiDesc', language)}</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🤖</div>
                                </div>
                            </div>
                            {/* Daily Flower Mala Service Card */}
                            <div onClick={(e) => handleNavigation(e, 'mala')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={Mala} alt="Daily Flower Mala" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">{t('home.malaTitle', language)}</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">{t('home.malaDesc', language)}</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🌸</div>
                                </div>
                            </div>
                            {/* Daily Puja Materials Card */}
                            <div className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        <img src={Samgri} alt="Daily Puja Materials" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">{t('home.samgriTitle', language)}</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">{t('home.samgriDesc', language)}</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🕯️</div>
                                </div>
                            </div>
                            {/* Astrology Kundali Card */}
                            <div onClick={(e) => handleNavigation(e, 'astrology')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={kundali} alt="Astrology Kundali" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">{t('home.kundaliTitle', language)}</h3>
                                    <p className="text-[#424242] text-center mb-4 font-devanagari">{t('home.kundaliDesc', language)}</p>
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
                                <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-6 font-serif">{t('home.aboutTitle', language)}</h2>
                                <p className="section-title text-lg text-[#424242] mb-6 leading-relaxed font-devanagari">
                                    {t('home.aboutDesc1', language)}
                                </p>
                                <p className="section-title text-lg text-[#424242] mb-6 leading-relaxed font-devanagari">
                                    {t('home.aboutDesc2', language)}
                                </p>
                                <p className="section-title text-lg text-[#FFB300] mb-6 leading-relaxed font-devanagari italic">
                                    {t('home.aboutMotto', language)}
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="text-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-4xl text-[#FFB300] mb-2 font-bold font-serif">2000+</div>
                                        <div className="text-[#424242] text-lg font-devanagari">{t('home.happyCustomers', language)}</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-4xl text-[#FFB300] mb-2 font-bold font-serif">20+</div>
                                        <div className="text-[#424242] text-lg font-devanagari">{t('home.yearsExperience', language)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="/img3.jpg"
                                            alt="Hindu Temple"
                                            className="w-full h-full object-fit"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/40 to-transparent"></div>
                                    </div>
                                    <div className="h-40 sm:h-48 md:h-48 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="/img2.jpg"
                                            alt="Lotus flower"
                                            className="w-full h-full object-fit"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB300]/40 to-transparent"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 sm:space-y-6 sm:mt-0 mt-8">
                                    <div className="h-40 sm:h-48 md:h-48 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="/img1.jpg"
                                            alt="Prayer beads"
                                            className="w-full h-full object-fit"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB300]/40 to-transparent"></div>
                                    </div>
                                    <div className="h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="/img5.jpg"
                                            alt="Hindu ceremony"
                                            className="w-full h-full object-fit"
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
                        <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">{t('home.deitiesTitle', language)}</h2>
                        <p className="section-title text-xl text-[#424242] mb-12 font-devanagari">{t('home.deitiesSubtitle', language)}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 max-w-6xl mx-auto">
                            {[
                                { key: 'surya', image: surya, shloka: "आदित्यस्य नमस्कारान् सर्वे भवन्तु सुखिनः" },
                                { key: 'ganesha', image: ganeshaUrl, shloka: "गजाननं भूतगणादिसेवितं कपित्थजम्बूफलसारभक्षितम्" },
                                { key: 'devi', image: devi, shloka: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता" },
                                { key: 'shiva', image: shivaUrl, shloka: "कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्" },
                                { key: 'vishnu', image: vishnu, shloka: "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम्" }
                            ].map((deity, index) => (
                                <div key={index} className="deity-card group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                    <div className="w-full h-72 sm:h-80 md:h-88 lg:h-96 mx-auto mb-6 overflow-hidden rounded-xl shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:saturate-150">
                                        <img src={deity.image} alt={deity.name} className="w-full h-full object-cover object-top bg-gradient-to-br from-gray-50 to-gray-100" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-3 font-serif">{translations.home[deity.key][language].name}</h3>
                                    <p className="text-[#424242] italic mb-3 font-devanagari leading-relaxed">{translations.home[deity.key][language].desc}</p>
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
                            <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">{t('home.testimonialsTitle', language)}</h2>
                            <p className="section-title text-xl text-[#424242] font-devanagari">{t('home.testimonialsSubtitle', language)}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { name: t('home.testimonial1.name', language), text: t('home.testimonial1.text', language), rating: 5 },
                                { name: t('home.testimonial2.name', language), text: t('home.testimonial2.text', language), rating: 5 },
                                { name: t('home.testimonial3.name', language), text: t('home.testimonial3.text', language), rating: 5 },
                                { name: t('home.testimonial4.name', language), text: t('home.testimonial4.text', language), rating: 5 }
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
                            <h2 className="section-title text-4xl font-bold mb-4 font-serif">{t('home.contactTitle', language)}</h2>
                            <p className="section-title text-xl opacity-90 font-devanagari">{t('home.contactDesc', language)}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <Phone className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2 font-devanagari">{t('home.callUs', language)}</h3>
                                <p className="opacity-90">+91 9458090609</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2 font-devanagari">{t('home.emailUs', language)}</h3>
                                <p className="opacity-90">help.archnam@gmail.com</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2 font-devanagari">{t('home.ourAddress', language)}</h3>
                                <p className="opacity-90">{t('home.location', language)}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button onClick={goToBooking} className="bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-lg font-devanagari">
                                {t('home.bookNow', language)}
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