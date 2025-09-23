import React, { useEffect, useRef } from 'react';
import { Truck, Droplets, Camera, Leaf, ArrowRight, CheckCircle } from 'lucide-react';

const nirmalyaBannerUrl = 'https://static.vecteezy.com/system/resources/previews/070/419/820/non_2x/diya-lamp-floating-in-water-a-festive-celebration-free-photo.jpg';

const NirmalyaPage = () => {
    const pageRef = useRef(null);
    const bannerRef = useRef(null);
    const whatIsNirmalyaRef = useRef(null);
    const serviceRef = useRef(null);
    const bookingRef = useRef(null);
    const packagesRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            
            // Page entrance animation
            window.gsap.fromTo(pageRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
            );
            
            // Parallax effect on banner
            window.gsap.to(bannerRef.current, {
                backgroundPosition: '50% 100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: bannerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
            
            // Animations for sections
            const sections = [
                { ref: whatIsNirmalyaRef, selector: '.lotus-icon, .nirmalya-title, .nirmalya-desc' },
                { ref: serviceRef, selector: '.service-card' },
                { ref: bookingRef, selector: '.booking-step' },
                { ref: packagesRef, selector: '.package-row' }
            ];
            
            sections.forEach(section => {
                const elements = section.ref.current?.querySelectorAll(section.selector);
                if (elements) {
                    window.gsap.fromTo(elements,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
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
            
            // Floating animation for service icons
            const serviceIcons = window.gsap.utils.toArray('.service-icon');
            serviceIcons.forEach(icon => {
                window.gsap.to(icon, {
                    y: -10,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: Math.random() * 0.5
                });
            });
        }
    }, []);

    return (
        <div ref={pageRef} className="bg-gradient-to-b from-[#F5F5F5] to-[#EEEEEE] text-[#424242] font-sans pt-16">
            {/* Top Banner with Parallax and Particles */}
            <header ref={bannerRef} className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${nirmalyaBannerUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/80 to-[#2E7D32]/90"></div>
                
                {/* Particles Effect */}
                <div className="absolute inset-0 z-0">
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-[#FFB300]/30" style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            animation: `float ${Math.random() * 10 + 10}s infinite linear`
                        }}></div>
                    ))}
                </div>
                
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">निर्माल्य सेवा</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow font-devanagari">आपकी पूजा अवशेषों का पवित्र विसर्जन</h2>
                    <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto font-sanskrit italic">
                        "गंगे च यमुने चैव गोदावरि सरस्वति। नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्तिष्ठ मे॥"
                    </p>
                    <a href="#book-nirmalya" className="mt-8 inline-block bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        अभी बुक करें
                    </a>
                </div>
            </header>
            
            {/* What is Nirmalya Section */}
            <section ref={whatIsNirmalyaRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="lotus-icon flex items-center justify-center mb-6">
                        <div className="text-5xl text-[#FFB300] mr-4 transform transition-transform duration-500 hover:scale-110">🪷</div>
                        <h3 className="nirmalya-title text-3xl font-bold text-[#1B5E20] font-serif">निर्माल्य क्या है?</h3>
                    </div>
                    <p className="nirmalya-desc max-w-3xl mx-auto text-lg leading-relaxed text-[#424242] bg-gradient-to-r from-[#FAFAFA] to-[#F5F5F5] p-6 rounded-xl shadow-md font-devanagari">
                        पूजा, आरती और यज्ञ के बाद, फूल, मालाएं, पत्ते, पवित्र धागे, सिंदूर और भस्म जैसी पवित्र चीजें बचती हैं। इन्हें निर्माल्य के रूप में जाना जाता है। इन्हें अनुचित तरीके से निपटाना अशुभ माना जाता है। हमारी सेवा इनका वैदिक मंत्रों के साथ पवित्र गंगा नदी में पवित्र विसर्जन सुनिश्चित करती है।
                    </p>
                </div>
            </section>
            
            {/* Our Service Section */}
            <section ref={serviceRef} className="py-16 md:py-20 bg-gradient-to-br from-[#F5F5F5] to-[#EEEEEE]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-4">हमारी सेवा</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="service-card flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <span className="service-icon text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full">
                                <Truck size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">आपके घर/दुकान से निर्माल्य का संग्रह</p>
                        </div>
                        <div className="service-card flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <span className="service-icon text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full">
                                <Droplets size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">वैदिक मंत्रों के साथ पवित्र गंगा में विसर्जन</p>
                        </div>
                        <div className="service-card flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <span className="service-icon text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full">
                                <Camera size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">विसर्जन का प्रमाण (फोटो/वीडियो) आपको भेजा जाएगा</p>
                        </div>
                        <div className="service-card flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                            <span className="service-icon text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full">
                                <Leaf size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">धार्मिक परंपरा और पर्यावरण संरक्षण का पालन</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* How to Book Section */}
            <section ref={bookingRef} id="book-nirmalya" className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-8">सेवा कैसे बुक करें?</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12 space-y-8 md:space-y-0">
                        <div className="booking-step flex flex-col items-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">1</div>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">हमारी वेबसाइट पर बुकिंग फॉर्म भरें</p>
                        </div>
                        <div className="text-3xl text-[#FFB300] hidden md:block animate-pulse">→</div>
                        <div className="booking-step flex flex-col items-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">2</div>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">हमारी टीम आपके पते से निर्माल्य एकत्र करेगी</p>
                        </div>
                        <div className="text-3xl text-[#FFB300] hidden md:block animate-pulse">→</div>
                        <div className="booking-step flex flex-col items-center p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">3</div>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">पवित्र विसर्जन + प्रमाण (फोटो/वीडियो)</p>
                        </div>
                    </div>
                    <button className="mt-12 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        निर्माल्य सेवा बुक करें
                    </button>
                </div>
            </section>
            
            {/* Packages Section */}
            <section ref={packagesRef} className="py-16 md:py-20 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-8">पैकेज और मूल्य निर्धारण</h3>
                    <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-xl">
                        <table className="w-full text-left border-collapse table-auto">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
                                    <th className="p-4 text-lg font-semibold border-b-2 border-gray-300 font-devanagari">पैकेज</th>
                                    <th className="p-4 text-lg font-semibold border-b-2 border-gray-300 font-devanagari">विवरण</th>
                                    <th className="p-4 text-lg font-semibold border-b-2 border-gray-300 font-devanagari">कीमत</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="package-row hover:bg-[#F5F5F5] transition-colors border-b border-gray-200">
                                    <td className="p-4 text-lg font-medium font-devanagari">एक बार सेवा</td>
                                    <td className="p-4 text-lg font-devanagari">निर्माल्य संग्रह और विसर्जन (स्थानीय क्षेत्र)</td>
                                    <td className="p-4 text-lg font-bold text-[#1B5E20]">₹499</td>
                                </tr>
                                <tr className="package-row hover:bg-[#F5F5F5] transition-colors">
                                    <td className="p-4 text-lg font-medium font-devanagari">मासिक पैकेज</td>
                                    <td className="p-4 text-lg font-devanagari">प्रति माह 4 सेवाएं</td>
                                    <td className="p-4 text-lg font-bold text-[#1B5E20]">₹1499</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
                
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
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
        </div>
    );
};

export default NirmalyaPage;