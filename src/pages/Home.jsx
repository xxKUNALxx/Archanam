import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Star, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import NirmalyaPage from './NirmalyaPage';
import PoojaPage from './PoojaPage';

// Main Home page image URLs
const homeBgUrl = 'https://plus.unsplash.com/premium_photo-1697730326674-74b6c70509f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const Yagya = 'https://i.pinimg.com/1200x/63/5f/60/635f60ca8b55e2adf8fbc8a94809b150.jpg';
const Pooja = 'https://i.pinimg.com/736x/ec/02/63/ec026397423fd6a9196d9a4f409e013d.jpg';
// Deities for the new section
const hanumanUrl = 'https://static.vecteezy.com/system/resources/previews/029/631/156/large_2x/3d-illustration-of-the-indian-god-hanuman-with-a-floral-background-surrounding-it-free-photo.jpeg';
const ganeshaUrl = 'https://static.vecteezy.com/system/resources/previews/069/750/796/non_2x/stone-carved-lord-ganesha-with-golden-aura-free-photo.jpg';
const shivaUrl = 'https://i.pinimg.com/736x/9e/8c/f2/9e8cf28e13396a028717cb3b4884cf83.jpg';
const krishnaUrl = 'https://i.pinimg.com/736x/f4/f0/6e/f4f06e2e49ea63a8d24e3fd51620995f.jpg';

// Navbar Component with Dropdown
const Navbar = ({ onNavigate }) => {
    const navRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap) {
            window.gsap.fromTo(navRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            );
        }
    }, []);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <nav ref={navRef} className="fixed top-0 w-full bg-[#1B5E20]/90 backdrop-blur-lg z-50 shadow-xl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <span className="text-[#FFB300] text-2xl animate-pulse">🕉️</span>
                        <span className="text-white text-xl font-bold font-serif">Archanam</span>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#home" onClick={(e) => onNavigate(e, 'home')} className="text-white hover:text-[#FFB300] transition-colors duration-300 relative group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFB300] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center space-x-1 text-white hover:text-[#FFB300] transition-colors focus:outline-none">
                                <span>Services</span>
                                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 z-20 transform transition-all duration-300 origin-top">
                                    <a href="#nirmalya" onClick={(e) => onNavigate(e, 'nirmalya')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5] transition-colors">Nirmalya Seva</a>
                                    <a href="#pooja" onClick={(e) => onNavigate(e, 'pooja')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5] transition-colors">Pooja Services</a>
                                </div>
                            )}
                        </div>
                        <a href="#about" onClick={(e) => onNavigate(e, 'home')} className="text-white hover:text-[#FFB300] transition-colors duration-300 relative group">
                            About Us
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFB300] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="#contact" onClick={(e) => onNavigate(e, 'home')} className="text-white hover:text-[#FFB300] transition-colors duration-300 relative group">
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFB300] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </div>
                    <div className="md:hidden">
                        <button className="text-white">☰</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

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
                            <h3 className="text-xl font-bold font-serif">Archanam</h3>
                        </div>
                        <p className="text-gray-300">Enriching your spiritual life with traditional Pooja and devotional services.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">Services</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">Home Pooja</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">Vrat & Fasting</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">Festival Pooja</li>
                            <li className="hover:text-[#FFB300] transition-colors cursor-pointer">Birthday Pooja</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">Contact</h4>
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
                                <span>Mangalagiri, Andhra Pradesh</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-[#FFB300] font-serif">Follow Us</h4>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFB300] transition-all duration-300 transform hover:scale-110">📘</div>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFB300] transition-all duration-300 transform hover:scale-110">📷</div>
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FFB300] transition-all duration-300 transform hover:scale-110">🐦</div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Archanam. All rights reserved.</p>
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
        if (currentPage === 'pooja') {
            return <PoojaPage />;
        }
        return (
            <>
                {/* Hero Section - Home Page with particles */}
                <section ref={heroRef} id="home" className="relative pt-20 min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${homeBgUrl})` }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 to-[#000000]/40"></div>
                    {/* Particles Effect */}
                    <div className="absolute inset-0 z-0">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="absolute rounded-full bg-[#FFB300]/20" style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 20 + 5}px`,
                                height: `${Math.random() * 20 + 5}px`,
                                animation: `float ${Math.random() * 10 + 10}s infinite linear`
                            }}></div>
                        ))}
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center text-white">
                        <h1 className="hero-title text-5xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight font-serif">
                            <span className="hero-title-main divine-text-shadow">Archanam</span>
                            <div className="text-3xl lg:text-4xl text-[#FFB300] mt-4 font-semibold">Divine Pooja Services</div>
                        </h1>
                        <p className="hero-subtitle text-xl lg:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md">
                            Experience divinity at your home with traditional Pooja rituals. Bring spiritual peace and prosperity into your life with our services.
                        </p>
                        <button className="hero-button bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-10 py-5 rounded-full text-xl font-bold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl tracking-wide">
                            Book A Service Now
                        </button>
                    </div>
                </section>
                
                {/* Services Section */}
                <section ref={servicesRef} id="services" className="py-20 bg-gradient-to-br from-[#F5F5F5] to-[#EEEEEE]">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">Our Services</h2>
                            <p className="section-title text-xl text-gray-600">Specialized services for your spiritual needs</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Pooja Services Card */}
                            <div onClick={(e) => handleNavigation(e, 'pooja')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        <img src={Pooja} alt="Pooja Services" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">Pooja Services</h3>
                                    <p className="text-[#424242] text-center mb-4">Book a wide range of poojas for any occasion.</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🙏</div>
                                </div>
                            </div>
                            {/* Nirmalya Seva Card */}
                            <div onClick={(e) => handleNavigation(e, 'nirmalya')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-[#FFB300] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <img src={Yagya} alt="Nirmalya Seva" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif text-center">Nirmalya Seva</h3>
                                    <p className="text-[#424242] text-center mb-4">Sacred and eco-friendly immersion of pooja remains.</p>
                                    <div className="text-3xl mt-auto text-[#FFB300] transform transition-transform duration-500 group-hover:scale-125">🌿</div>
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
                                <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-6 font-serif">About Us</h2>
                                <p className="section-title text-lg text-[#424242] mb-6 leading-relaxed">
                                    At Archanam, our mission is to bring spirituality and divinity into your life. Our experienced Pandits perform all Pooja ceremonies according to traditional Vedic rituals.
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="text-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-4xl text-[#FFB300] mb-2 font-bold font-serif">500+</div>
                                        <div className="text-[#424242] text-lg">Happy Clients</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
                                        <div className="text-4xl text-[#FFB300] mb-2 font-bold font-serif">10+</div>
                                        <div className="text-[#424242] text-lg">Years of Experience</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-48 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Hindu Temple"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/40 to-transparent"></div>
                                    </div>
                                    <div className="h-36 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Lotus flower"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB300]/40 to-transparent"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="h-36 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Prayer beads"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFB300]/40 to-transparent"></div>
                                    </div>
                                    <div className="h-48 rounded-xl overflow-hidden shadow-lg relative transform transition-transform duration-500 hover:scale-105">
                                        <img
                                            src="https://images.unsplash.com/photo-1609952667214-cc8f73d07db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
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
                        <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">Divine Deities</h2>
                        <p className="section-title text-xl text-[#424242] mb-12">Learn about the deities we honor in our ceremonies</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { name: "Lord Ganesha", image: ganeshaUrl, desc: "The remover of obstacles and god of new beginnings." },
                                { name: "Lord Hanuman", image: hanumanUrl, desc: "The symbol of strength, devotion, and perseverance." },
                                { name: "Lord Shiva", image: shivaUrl, desc: "The destroyer of evil and the source of creation." },
                                { name: "Lord Krishna", image: krishnaUrl, desc: "The god of compassion, love, and spiritual knowledge." }
                            ].map((deity, index) => (
                                <div key={index} className="deity-card group p-6 rounded-2xl shadow-lg bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-[#FFB300]">
                                    <div className="w-full h-56 mx-auto mb-4 overflow-hidden rounded-lg shadow-md transition-all duration-500 group-hover:scale-105 group-hover:saturate-150">
                                        <img src={deity.image} alt={deity.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1B5E20] mb-2 font-serif">{deity.name}</h3>
                                    <p className="text-[#424242] italic">{deity.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Testimonials Section */}
                <section ref={testimonialsRef} className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="section-title text-4xl font-bold text-[#1B5E20] mb-4 font-serif">Client Testimonials</h2>
                            <p className="section-title text-xl text-[#424242]">Feedback from our satisfied clients</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Ram Sharma", text: "Performed a very sacred and beautiful Pooja. Felt a divine presence at home.", rating: 5 },
                                { name: "Sita Devi", text: "The festival Pooja was wonderful. All rituals were performed perfectly.", rating: 5 },
                                { name: "Gopal Ji", text: "Arrived on time and performed the Pooja very well. Thank you!", rating: 5 }
                            ].map((testimonial, index) => (
                                <div key={index} className="testimonial-card bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] p-6 rounded-2xl shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-[#FFB300] text-[#FFB300]" />
                                        ))}
                                    </div>
                                    <p className="text-[#424242] mb-4 italic text-base">"{testimonial.text}"</p>
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
                            <h2 className="section-title text-4xl font-bold mb-4 font-serif">Contact Us</h2>
                            <p className="section-title text-xl opacity-90">Book your Pooja today</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <Phone className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                                <p className="opacity-90">+91 98765 43210</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                                <p className="opacity-90">info@bhaktiseva.com</p>
                            </div>
                            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl transform transition-transform duration-300 hover:scale-105">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-[#FFB300]" />
                                <h3 className="text-xl font-semibold mb-2">Address</h3>
                                <p className="opacity-90">Mangalagiri, Andhra Pradesh</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Book Now
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
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
                .divine-text-shadow {
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }
            `}</style>
            <Navbar onNavigate={handleNavigation} />
            {renderPage()}
            <Footer />
        </div>
    );
};

export default Home;