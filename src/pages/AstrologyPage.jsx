import React, { useEffect, useRef } from 'react';

const bannerUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80';

const AstrologyPage = () => {
    const pageRef = useRef(null);
    const bannerRef = useRef(null);
    const introRef = useRef(null);
    const detailsRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            window.gsap.fromTo(pageRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
            window.gsap.to(bannerRef.current, {
                backgroundPosition: '50% 100%',
                ease: 'none',
                scrollTrigger: { trigger: bannerRef.current, start: 'top top', end: 'bottom top', scrub: true }
            });
            const sections = [
                { ref: introRef, selector: '.astro-intro' },
                { ref: detailsRef, selector: '.astro-item' }
            ];
            sections.forEach(section => {
                const els = section.ref.current?.querySelectorAll(section.selector);
                if (els) {
                    window.gsap.fromTo(els, { y: 50, opacity: 0 }, {
                        y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out',
                        scrollTrigger: { trigger: section.ref.current, start: 'top 80%', toggleActions: 'play none none none' }
                    });
                }
            });
        }
    }, []);

    const goToBooking = () => {
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/booking');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    return (
        <div ref={pageRef} className="bg-gradient-to-b from-white to-[#F5F5F5] text-[#424242] font-sans pt-16">
            <header ref={bannerRef} className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${bannerUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#2E7D32]/70 to-[#1B5E20]/90"></div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">प्रामाणिक ज्योतिष कुंडली विश्लेषण — ₹251</h1>
                    <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto font-devanagari">
                        हम आपकी जिंदगी के अहम सवालों का समाधान शास्त्रीय और व्यावहारिक ज्योतिष से प्रदान करते हैं। हमारा विश्लेषण उच्च संस्कृत वेदपाठी पंडितों द्वारा किया जाता है — वर्षों का अनुभव, पारंपरिक शास्त्रों की गहरी समझ और कई मामलों में सफल उपायों का रिकॉर्ड।
                    </p>
                    <button onClick={goToBooking} className="mt-6 inline-block bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        अभी बुक करें
                    </button>
                </div>
            </header>

            <section ref={introRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="astro-intro max-w-4xl mx-auto bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] p-8 rounded-2xl shadow-lg">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-4">हम क्या देते हैं</h3>
                        <ul className="list-disc pl-6 space-y-2 text-lg font-devanagari">
                            <li>जन्म कुंडली पर विस्तृत व्याख्या (लग्न, दशा, योग आदि)</li>
                            <li>विवाह, करियर, वित्त, स्वास्थ्य व पारिवारिक सुझाव</li>
                            <li>विशिष्ट ग्रह दोषों के लिए उपाय और तात्कालिक मार्गदर्शन</li>
                            <li>लिखित रिपोर्ट या कस्टम कंसल्टेशन (आपके चयन अनुसार)</li>
                        </ul>
                        <div className="mt-6 text-[#1B5E20] font-semibold font-devanagari">विश्वास और गोपनीयता: आपकी जानकारी पूर्ण रूप से गोपनीय रखी जाती है।</div>
                    </div>
                </div>
            </section>

            <section ref={detailsRef} className="py-12 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="astro-item p-6 bg-white rounded-2xl shadow-md">
                            <div className="text-xl font-bold text-[#1B5E20] font-serif mb-2">शुल्क</div>
                            <p className="font-devanagari">केवल ₹251 — एक बार बुकिंग पर पंडित द्वारा विशेषज्ञ विश्लेषण।</p>
                        </div>
                        <div className="astro-item p-6 bg-white rounded-2xl shadow-md">
                            <div className="text-xl font-bold text-[#1B5E20] font-serif mb-2">कैसे बुक करें?</div>
                            <p className="font-devanagari">अपनी जन्मतिथि, जन्मसमय और जन्मस्थान भेजकर अभी बुक करें — हमें आपकी भलाई की चिंता है।</p>
                        </div>
                    </div>
                    <div className="text-center mt-10">
                        <button onClick={goToBooking} className="bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                            ज्योतिष परामर्श बुक करें
                        </button>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
                .font-devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
                .font-serif { font-family: 'Noto Serif Devanagari', serif; }
            `}</style>
        </div>
    );
};

export default AstrologyPage;


