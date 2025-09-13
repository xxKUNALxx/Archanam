import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';
import NirmalyaPage from './NirmalyaPage';
import PoojaPage from './PoojaPage'; 

// Main Home page image URLs
const homeBgUrl = 'https://static.vecteezy.com/system/resources/previews/024/743/222/large_2x/majestic-pagoda-illuminated-at-dusk-symbol-of-spirituality-generated-by-ai-free-photo.jpg';
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
        <nav ref={navRef} className="fixed top-0 w-full bg-gradient-to-r from-orange-800 via-red-700 to-pink-600 backdrop-blur-md z-50 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        {/* <div className="text-white text-2xl">🕉️</div> */}
                        <span className="text-white text-xl font-bold font-serif">Archanam</span>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#home" onClick={(e) => onNavigate(e, 'home')} className="text-white hover:text-yellow-300 transition-colors">Home</a>

                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors focus:outline-none">
                                <span>Services</span>
                                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                    <a href="#nirmalya" onClick={(e) => onNavigate(e, 'nirmalya')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Nirmalya Seva</a>
                                    <a href="#pooja" onClick={(e) => onNavigate(e, 'pooja')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Pooja Services</a>
                                </div>
                            )}
                        </div>

                        <a href="#about" onClick={(e) => onNavigate(e, 'home')} className="text-white hover:text-yellow-300 transition-colors">About Us</a>
                        <a href="#contact" onClick={(e) => onNavigate(e, 'home')} className="text-white hover:text-yellow-300 transition-colors">Contact</a>
                    </div>
                    <div className="md:hidden">
                        <button className="text-white">☰</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Footer Component (remains unchanged)
const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-orange-900 via-red-900 to-pink-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="text-yellow-400 text-xl">🕉️</div>
                            <h3 className="text-xl font-bold font-serif">Archanam</h3>
                        </div>
                        <p className="text-orange-200">Enriching your spiritual life with traditional Pooja and devotional services.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-yellow-400 font-serif">Services</h4>
                        <ul className="space-y-2 text-orange-200">
                            <li>Home Pooja</li>
                            <li>Vrat & Fasting</li>
                            <li>Festival Pooja</li>
                            <li>Birthday Pooja</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-yellow-400 font-serif">Contact</h4>
                        <div className="space-y-2 text-orange-200">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>info@bhaktiseva.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>Mangalagiri, Andhra Pradesh</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-yellow-400 font-serif">Follow Us</h4>
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-500 transition-colors">📘</div>
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors">📷</div>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-400 transition-colors">🐦</div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-300">
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
    const deitiesRef = useRef(null); // New ref for the deities section

    const [currentPage, setCurrentPage] = useState('home');

    // This handles the navigation and page state change
    const handleNavigation = (e, page) => {
        e.preventDefault();
        setCurrentPage(page);
        // Scroll to the top of the new page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // This effect handles the animations for the home page sections
    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);

            // Re-run animations for the home page only
            if (currentPage === 'home') {
                // Hero section animations
                window.gsap.fromTo(heroRef.current?.querySelector('.hero-title'),
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
                );
                window.gsap.fromTo(heroRef.current?.querySelector('.hero-subtitle'),
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 }
                );
                window.gsap.fromTo(heroRef.current?.querySelector('.hero-button'),
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 1.5 }
                );

                // Scroll-triggered animations for other sections
                window.gsap.fromTo(servicesRef.current?.querySelectorAll('.service-card'),
                    { y: 100, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: servicesRef.current,
                            start: "top 80%",
                            end: "bottom 20%",
                        }
                    }
                );
                window.gsap.fromTo(aboutRef.current?.querySelector('.about-content'),
                    { x: -100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        scrollTrigger: {
                            trigger: aboutRef.current,
                            start: "top 80%",
                        }
                    }
                );
                window.gsap.fromTo(testimonialsRef.current?.querySelectorAll('.testimonial-card'),
                    { scale: 0.8, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.3,
                        scrollTrigger: {
                            trigger: testimonialsRef.current,
                            start: "top 80%",
                        }
                    }
                );
                // Animation for the deities section
                window.gsap.fromTo(deitiesRef.current?.querySelectorAll('.deity-card'),
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: deitiesRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }
        }
    }, [currentPage]);

    // Conditional rendering based on the currentPage state
    const renderPage = () => {
        if (currentPage === 'nirmalya') {
            return <NirmalyaPage />;
        }
        if (currentPage === 'pooja') {
            return <PoojaPage />;
        }
        return (
            <>
                {/* Hero Section - Home Page */}
                <section ref={heroRef} id="home" className="relative pt-20 min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${homeBgUrl})` }}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center text-white">
                        <h1 className="hero-title text-5xl lg:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight font-serif">
                            Archanam
                            <div className="text-3xl lg:text-4xl text-yellow-300 mt-4 font-semibold">Divine Pooja Services</div>
                        </h1>
                        <p className="hero-subtitle text-xl lg:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md">
                            Experience divinity at your home with traditional Pooja rituals. Bring spiritual peace and prosperity into your life with our services.
                        </p>
                        <button className="hero-button bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl tracking-wide">
                            Book A Service Now
                        </button>
                    </div>
                </section>

                {/* Services Section */}
                <section ref={servicesRef} id="services" className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-orange-800 mb-4 font-serif">Our Services</h2>
                            <p className="text-xl text-gray-600">Specialized services for your spiritual needs</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Pooja Services Card */}
                            <div onClick={(e) => handleNavigation(e, 'pooja')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-orange-300 transition-transform duration-300 group-hover:scale-110">
                                        <img src={Pooja} alt="Pooja Services" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-orange-800 mb-2 font-serif text-center">Pooja Services</h3>
                                    <p className="text-gray-700 text-center mb-4">Book a wide range of poojas for any occasion.</p>
                                    <div className="text-3xl mt-auto">🙏</div>
                                </div>
                            </div>
                            {/* Nirmalya Seva Card */}
                            <div onClick={(e) => handleNavigation(e, 'nirmalya')} className="service-card cursor-pointer group p-8 rounded-2xl shadow-xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-orange-300 transition-transform duration-300 group-hover:scale-110">
                                        <img src={Yagya} alt="Nirmalya Seva" className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-orange-800 mb-2 font-serif text-center">Nirmalya Seva</h3>
                                    <p className="text-gray-700 text-center mb-4">Sacred and eco-friendly immersion of pooja remains.</p>
                                    <div className="text-3xl mt-auto">🌿</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section ref={aboutRef} id="about" className="py-20 bg-gradient-to-r from-orange-100 to-pink-100">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="about-content">
                                <h2 className="text-4xl font-bold text-orange-800 mb-6 font-serif">About Us</h2>
                                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                                    At Archanam, our mission is to bring spirituality and divinity into your life. Our experienced Pandits perform all Pooja ceremonies according to traditional Vedic rituals.
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-200">
                                        <div className="text-4xl text-orange-600 mb-2 font-bold font-serif">500+</div>
                                        <div className="text-gray-700 text-lg">Happy Clients</div>
                                    </div>
                                    <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-200">
                                        <div className="text-4xl text-orange-600 mb-2 font-bold font-serif">10+</div>
                                        <div className="text-gray-700 text-lg">Years of Experience</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="h-48 rounded-xl overflow-hidden shadow-lg relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Hindu Temple"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-orange-500/20"></div>
                                    </div>
                                    <div className="h-36 rounded-xl overflow-hidden shadow-lg relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Lotus flower"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-pink-500/20"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="h-36 rounded-xl overflow-hidden shadow-lg relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Prayer beads"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-purple-500/20"></div>
                                    </div>
                                    <div className="h-48 rounded-xl overflow-hidden shadow-lg relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1609952667214-cc8f73d07db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                            alt="Hindu ceremony"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-red-500/20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* New Divine Deities Section */}
                <section ref={deitiesRef} id="deities" className="py-20 bg-gradient-to-r from-yellow-50 to-pink-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold text-orange-800 mb-4 font-serif">Divine Deities</h2>
                        <p className="text-xl text-gray-600 mb-12">Learn about the deities we honor in our ceremonies</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { name: "Lord Ganesha", image: ganeshaUrl, desc: "The remover of obstacles and god of new beginnings." },
                                { name: "Lord Hanuman", image: hanumanUrl, desc: "The symbol of strength, devotion, and perseverance." },
                                { name: "Lord Shiva", image: shivaUrl, desc: "The destroyer of evil and the source of creation." },
                                { name: "Lord Krishna", image: krishnaUrl, desc: "The god of compassion, love, and spiritual knowledge." }
                            ].map((deity, index) => (
                                <div key={index} className="deity-card group p-6 rounded-2xl shadow-xl bg-white border border-yellow-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                    <div className="w-full h-56 mx-auto mb-4 overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:scale-105 group-hover:saturate-150">
                                        <img src={deity.image} alt={deity.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-orange-800 mb-2 font-serif">{deity.name}</h3>
                                    <p className="text-gray-700 italic">{deity.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section ref={testimonialsRef} className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-orange-800 mb-4 font-serif">Client Testimonials</h2>
                            <p className="text-xl text-gray-600">Feedback from our satisfied clients</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Ram Sharma", text: "Performed a very sacred and beautiful Pooja. Felt a divine presence at home.", rating: 5 },
                                { name: "Sita Devi", text: "The festival Pooja was wonderful. All rituals were performed perfectly.", rating: 5 },
                                { name: "Gopal Ji", text: "Arrived on time and performed the Pooja very well. Thank you!", rating: 5 }
                            ].map((testimonial, index) => (
                                <div key={index} className="testimonial-card bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-orange-200">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-4 italic text-base">"{testimonial.text}"</p>
                                    <div className="font-semibold text-orange-800 text-lg">- {testimonial.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4 font-serif">Contact Us</h2>
                            <p className="text-xl opacity-90">Book your Pooja today</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="text-center">
                                <Phone className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                                <p className="opacity-90">+91 98765 43210</p>
                            </div>
                            <div className="text-center">
                                <Mail className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                                <p className="opacity-90">info@bhaktiseva.com</p>
                            </div>
                            <div className="text-center">
                                <MapPin className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                                <h3 className="text-xl font-semibold mb-2">Address</h3>
                                <p className="opacity-90">Mangalagiri, Andhra Pradesh</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Book Now
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50 font-sans">
            <Navbar onNavigate={handleNavigation} />
            {renderPage()}
            <Footer />
        </div>
    );
};

export default Home;


