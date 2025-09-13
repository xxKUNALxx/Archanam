import React, { useEffect, useRef } from 'react';
import { Truck, Droplets, Camera, Leaf } from 'lucide-react';


const nirmalyaBannerUrl = 'https://static.vecteezy.com/system/resources/previews/070/419/820/non_2x/diya-lamp-floating-in-water-a-festive-celebration-free-photo.jpg';

const NirmalyaPage = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
            window.gsap.fromTo(pageRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", stagger: 0.3 }
            );
        }
    }, []);

    return (
        <div ref={pageRef} className="bg-white text-gray-800 font-sans">
            {/* Top Banner */}
            <header className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${nirmalyaBannerUrl})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">Nirmalya Seva</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow">The Sacred Immersion of Your Pooja Remains</h2>
                    <a href="#book-nirmalya" className="mt-8 inline-block bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        Book Now
                    </a>
                </div>
            </header>

            {/* What is Nirmalya Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="text-4xl text-yellow-600 mr-4">🪷</div>
                        <h3 className="text-3xl font-bold text-orange-800">What is Nirmalya?</h3>
                    </div>
                    <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700">
                        After Pooja, Aarti, and Yagya, sacred offerings like flowers, garlands, leaves, holy threads, vermilion, and ashes remain. These are known as Nirmalya. It is considered inauspicious to dispose of them improperly. Our service ensures their sacred immersion into the holy Ganga river with Vedic chants.
                    </p>
                </div>
            </section>

            {/* Our Service Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-orange-800 mb-4">Our Service</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-orange-50 transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-orange-600">
                                <Truck size={48} />
                            </span>
                            <p className="text-lg font-medium">Collection of Nirmalya from your home/shop</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-red-50 transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-red-600">
                                <Droplets size={48} />
                            </span>
                            <p className="text-lg font-medium">Sacred immersion in the holy Ganga with Vedic chants</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-pink-50 transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-pink-600">
                                <Camera size={48} />
                            </span>
                            <p className="text-lg font-medium">Photo/video proof of immersion will be sent to you</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg bg-yellow-50 transition-transform transform hover:scale-105">
                            <span className="text-4xl mb-4 text-yellow-600">
                                <Leaf size={48} />
                            </span>
                            <p className="text-lg font-medium">Adherence to religious tradition and environmental protection</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Book Section */}
            <section id="book-nirmalya" className="py-16 md:py-20 bg-gradient-to-r from-orange-100 to-pink-100">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-orange-800 mb-8">How to Book the Service?</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12 space-y-8 md:space-y-0">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-orange-600 text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">1</div>
                            <p className="text-lg font-medium text-gray-700">Fill out the booking form on our website</p>
                        </div>
                        <div className="text-2xl text-orange-600 hidden md:block">→</div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-orange-600 text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">2</div>
                            <p className="text-lg font-medium text-gray-700">Our team will collect the Nirmalya from your address</p>
                        </div>
                        <div className="text-2xl text-orange-600 hidden md:block">→</div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-orange-600 text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-md">3</div>
                            <p className="text-lg font-medium text-gray-700">Sacred immersion + proof (photo/video)</p>
                        </div>
                    </div>
                    <button className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                        Book Nirmalya Seva
                    </button>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-orange-800 mb-8">Packages and Pricing</h3>
                    <div className="max-w-3xl mx-auto overflow-x-auto">
                        <table className="w-full text-left border-collapse table-auto">
                            <thead>
                                <tr className="bg-orange-200">
                                    <th className="p-4 text-lg font-semibold text-orange-800 border-b-2 border-orange-300">Package</th>
                                    <th className="p-4 text-lg font-semibold text-orange-800 border-b-2 border-orange-300">Description</th>
                                    <th className="p-4 text-lg font-semibold text-orange-800 border-b-2 border-orange-300">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100 transition-colors">
                                    <td className="p-4 text-lg border-b border-gray-200">One-time Service</td>
                                    <td className="p-4 text-lg border-b border-gray-200">Nirmalya collection and immersion (local area)</td>
                                    <td className="p-4 text-lg font-bold text-orange-700 border-b border-gray-200">₹499</td>
                                </tr>
                                <tr className="hover:bg-gray-100 transition-colors">
                                    <td className="p-4 text-lg border-b border-gray-200">Monthly Package</td>
                                    <td className="p-4 text-lg border-b border-gray-200">4 services per month</td>
                                    <td className="p-4 text-lg font-bold text-orange-700 border-b border-gray-200">₹1499</td>
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