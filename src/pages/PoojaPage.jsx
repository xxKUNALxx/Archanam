import React, { useEffect, useRef } from 'react';
import { Leaf, Award, Handshake, Globe } from 'lucide-react';

const poojaBannerUrl = 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
const poojaService1 = 'https://images.unsplash.com/photo-1598379435436-1e0c2b2a2b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const poojaService2 = 'https://images.unsplash.com/photo-1557020815-51e9e09d0a6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const poojaService3 = 'https://images.unsplash.com/photo-1582035905152-4a0b2b2a2b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

const PoojaPage = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
            window.gsap.fromTo(pageRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <div ref={pageRef} className="bg-white text-gray-800 font-sans">
            {/* Top Banner */}
            <header className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${poojaBannerUrl})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">Pooja Services</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow">Bringing Divinity to Your Doorstep</h2>
                    <a href="#pooja-services-list" className="mt-8 inline-block bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        View Our Services
                    </a>
                </div>
            </header>

            {/* Introduction to Pooja Services */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-orange-800 font-serif mb-6">Our Commitment to Sacred Rituals</h3>
                    <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700">
                        At Archanam, we provide a wide range of traditional Pooja services performed by experienced and knowledgeable Pandits. Our goal is to help you connect with your spiritual side and bring peace, prosperity, and blessings to your life. All rituals are performed with utmost devotion and according to authentic Vedic traditions.
                    </p>
                </div>
            </section>

            {/* List of Pooja Services */}
            <section id="pooja-services-list" className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-orange-800 font-serif mb-4">Explore Our Pooja Offerings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Ganesh Pooja", image: poojaService1, desc: "Invoking Lord Ganesha to remove obstacles and bring good fortune." },
                            { title: "Satyanarayan Pooja", image: poojaService2, desc: "A sacred ritual for health, wealth, and prosperity." },
                            { title: "Griha Pravesh", image: poojaService3, desc: "Housewarming ceremony to purify and bless your new home." },
                            { title: "Rudrabhishek", image: poojaService1, desc: "A powerful Pooja dedicated to Lord Shiva for spiritual cleansing and peace." },
                            { title: "Navagraha Shanti", image: poojaService2, desc: "Pacifying the nine planetary deities to mitigate malefic effects." },
                            { title: "Vivah Sanskar", image: poojaService3, desc: "Traditional wedding rituals for a blissful married life." }
                        ].map((service, index) => (
                            <div key={index} className="pooja-card group p-6 rounded-2xl shadow-xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="w-full h-56 mx-auto mb-4 overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:scale-105 group-hover:saturate-150">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-bold text-orange-800 mb-2 font-serif">{service.title}</h3>
                                <p className="text-gray-700 italic">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PoojaPage;