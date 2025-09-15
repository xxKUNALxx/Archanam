import React, { useEffect, useRef } from 'react';
import { Truck, Droplets, Camera, Leaf } from 'lucide-react';

const nirmalyaBannerUrl = 'https://static.vecteezy.com/system/resources/previews/070/419/820/non_2x/diya-lamp-floating-in-water-a-festive-celebration-free-photo.jpg';

const NirmalyaPage = () => {
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
        <div ref={pageRef} className="bg-[#F5F5F5] text-[#424242] font-sans pt-16">
            {/* Top Banner with Parallax and Particles */}
            <header className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${nirmalyaBannerUrl})` }}>
                <div className="absolute inset-0 bg-[#1B5E20]/70"></div>
                {/* Particles Effect */}
                <div className="absolute inset-0 z-0">
                    <div className="particle animate-particle-1"></div>
                    <div className="particle animate-particle-2"></div>
                    <div className="particle animate-particle-3"></div>
                    <div className="particle animate-particle-4"></div>
                </div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">Nirmalya Seva</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow">The Sacred Immersion of Your Pooja Remains</h2>
                    <a href="#book-nirmalya" className="mt-8 inline-block bg-[#FFB300] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#FFC107] transform hover:scale-105 transition-all duration-300 shadow-lg">
                        Book Now
                    </a>
                </div>
            </header>

            {/* What is Nirmalya Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="text-4xl text-[#FFB300] mr-4">🪷</div>
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">What is Nirmalya?</h3>
                    </div>
                    <p className="max-w-3xl mx-auto text-lg leading-relaxed text-[#424242]">
                        After Pooja, Aarti, and Yagya, sacred offerings like flowers, garlands, leaves, holy threads, vermilion, and ashes remain. These are known as Nirmalya. It is considered inauspicious to dispose of them improperly. Our service ensures their sacred immersion into the holy Ganga river with Vedic chants.
                    </p>
                </div>
            </section>

            {/* Our Service Section */}
            <section className="py-16 md:py-20 bg-[#F5F5F5]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-4">Our Service</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-[#FFB300]">
                                <Truck size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242]">Collection of Nirmalya from your home/shop</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-[#FFB300]">
                                <Droplets size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242]">Sacred immersion in the holy Ganga with Vedic chants</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-[#FFB300]">
                                <Camera size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242]">Photo/video proof of immersion will be sent to you</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-[#FFB300]">
                                <Leaf size={48} />
                            </span>
                            <p className="text-lg font-medium text-[#424242]">Adherence to religious tradition and environmental protection</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Book Section */}
            <section id="book-nirmalya" className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-8">How to Book the Service?</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12 space-y-8 md:space-y-0">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[#1B5E20] text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">1</div>
                            <p className="text-lg font-medium text-[#424242]">Fill out the booking form on our website</p>
                        </div>
                        <div className="text-2xl text-[#FFB300] hidden md:block">→</div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[#1B5E20] text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">2</div>
                            <p className="text-lg font-medium text-[#424242]">Our team will collect the Nirmalya from your address</p>
                        </div>
                        <div className="text-2xl text-[#FFB300] hidden md:block">→</div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[#1B5E20] text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">3</div>
                            <p className="text-lg font-medium text-[#424242]">Sacred immersion + proof (photo/video)</p>
                        </div>
                    </div>
                    <button className="mt-12 bg-[#FFB300] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#FFC107] transform hover:scale-105 transition-all duration-300 shadow-xl">
                        Book Nirmalya Seva
                    </button>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-16 md:py-20 bg-[#FAFAFA]">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-8">Packages and Pricing</h3>
                    <div className="max-w-3xl mx-auto overflow-x-auto">
                        <table className="w-full text-left border-collapse table-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-4 text-lg font-semibold text-[#1B5E20] border-b-2 border-gray-300">Package</th>
                                    <th className="p-4 text-lg font-semibold text-[#1B5E20] border-b-2 border-gray-300">Description</th>
                                    <th className="p-4 text-lg font-semibold text-[#1B5E20] border-b-2 border-gray-300">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100 transition-colors">
                                    <td className="p-4 text-lg border-b border-gray-200">One-time Service</td>
                                    <td className="p-4 text-lg border-b border-gray-200">Nirmalya collection and immersion (local area)</td>
                                    <td className="p-4 text-lg font-bold text-[#1B5E20] border-b border-gray-200">₹499</td>
                                </tr>
                                <tr className="hover:bg-gray-100 transition-colors">
                                    <td className="p-4 text-lg border-b border-gray-200">Monthly Package</td>
                                    <td className="p-4 text-lg border-b border-gray-200">4 services per month</td>
                                    <td className="p-4 text-lg font-bold text-[#1B5E20] border-b border-gray-200">₹1499</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NirmalyaPage;