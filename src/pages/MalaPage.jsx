import React, { useEffect, useRef } from 'react';
import { Flower2, Truck, Leaf, Sparkles, CheckCircle } from 'lucide-react';

const malaBannerUrl = 'https://images.unsplash.com/photo-1596315450055-c7b1f8f57024?q=80&w=1200&auto=format&fit=crop';

const MalaPage = () => {
    const pageRef = useRef(null);
    const bannerRef = useRef(null);
    const introRef = useRef(null);
    const benefitsRef = useRef(null);
    const plansRef = useRef(null);
    const howItWorksRef = useRef(null);

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
                { ref: introRef, selector: '.mala-intro' },
                { ref: benefitsRef, selector: '.mala-benefit' },
                { ref: plansRef, selector: '.mala-plan' },
                { ref: howItWorksRef, selector: '.mala-step' }
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
            {/* Banner */}
            <header ref={bannerRef} className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${malaBannerUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#2E7D32]/70 to-[#1B5E20]/90"></div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">डेली फूल माला सेवा</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow font-devanagari">भक्ति-भाव से ताज़ी मालाएँ, रोज़ आपके घर तक</h2>
                    <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto font-sanskrit italic">"पुष्पं पत्रं फलं तोयं यो मे भक्त्या प्रयच्छति"</p>
                    <button onClick={goToBooking} className="mt-8 inline-block bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        अभी सब्सक्राइब/बुक करें
                    </button>
                </div>
            </header>

            {/* Intro */}
            <section ref={introRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mala-intro max-w-4xl mx-auto bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] p-8 rounded-2xl shadow-lg">
                        <div className="flex items-start gap-4 mb-4">
                            <Flower2 className="w-10 h-10 text-[#FFB300]" />
                            <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">फूल माला का महत्व</h3>
                        </div>
                        <div className="space-y-3 text-lg font-devanagari">
                            <p>हिंदू परंपरा में फूल शुद्धता, प्रेम और भक्ति का प्रतीक हैं। भगवान को पुष्प अर्पण करना हमारे मन की आस्था और श्रद्धा का प्रतीक है।</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>फूलों की सुगंध से वातावरण पवित्र होता है।</li>
                                <li>माला अर्पित करने से मन में भक्ति और शांति बनी रहती है।</li>
                                <li>देवी-देवताओं को फूल प्रिय माने गए हैं।</li>
                                <li>पूजा में पुष्प अर्पित करने से घर में सकारात्मक ऊर्जा का संचार होता है।</li>
                            </ul>
                            <p className="mt-4">रोज़ाना पूजा में फूल अर्पित करने से घर-परिवार पर ईश्वर की कृपा और आशीर्वाद बना रहता है।</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section ref={benefitsRef} className="py-16 md:py-20 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">हमारी डेली माला सेवा</h3>
                        <p className="text-[#424242] font-devanagari">ताज़े, शुद्ध और समय पर डिलीवर किए गए फूल एवं मालाएँ</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><Sparkles size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">सुबह-सुबह ताज़ी माला/फूल</p>
                        </div>
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><Truck size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">डोर-स्टेप डिलीवरी (रोज़/निर्धारित दिन)</p>
                        </div>
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><Leaf size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">शुद्ध, सत्त्विक और पर्यावरण-अनुकूल पैकिंग</p>
                        </div>
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><CheckCircle size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">लचीली सब्सक्रिप्शन: डेली/वीकली/मंथली</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans & Pricing */}
            <section ref={plansRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">प्लान एवं मूल्य</h3>
                        <p className="text-[#424242] font-devanagari">सरल और किफायती — घर बैठे भक्ति</p>
                    </div>
                    <div className="max-w-3xl mx-auto mala-plan p-8 rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[#1B5E20] font-serif mb-2">मंथली प्लान</div>
                                <ul className="list-disc pl-6 space-y-1 text-lg text-[#424242] font-devanagari">
                                    <li>केवल ₹600 में पूरे महीने (30 दिन)</li>
                                    <li>रोज़ाना 1 पूजा माला + कुछ ताज़े फूल</li>
                                    <li>आपके दरवाज़े पर सीधी होम डिलीवरी</li>
                                </ul>
                            </div>
                            <div className="text-center md:text-right">
                                <div className="text-4xl font-extrabold text-[#1B5E20]">₹600</div>
                                <div className="text-sm text-[#424242] opacity-80 font-devanagari">30 दिन | डोर-स्टेप</div>
                                <button onClick={goToBooking} className="mt-4 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-6 py-2 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-md font-devanagari">
                                    सब्सक्राइब करें
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section ref={howItWorksRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-8">कैसे काम करता है?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="mala-step p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4">1</div>
                            <p className="text-lg font-medium font-devanagari">प्लान चुनें: डेली/वीकली/मंथली</p>
                        </div>
                        <div className="mala-step p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4">2</div>
                            <p className="text-lg font-medium font-devanagari">सुबह निश्चित समय पर डिलीवरी</p>
                        </div>
                        <div className="mala-step p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4">3</div>
                            <p className="text-lg font-medium font-devanagari">पूजा में पुष्प/माला अर्पित करें, दिव्यता अनुभव करें</p>
                        </div>
                    </div>
                    <button onClick={goToBooking} className="mt-12 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        डेली माला सेवा बुक करें
                    </button>
                </div>
            </section>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
                .font-devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
                .font-serif { font-family: 'Noto Serif Devanagari', serif; }
                .font-sanskrit { font-family: 'Noto Sans Devanagari', sans-serif; font-style: italic; }
            `}</style>
        </div>
    );
};

export default MalaPage;


