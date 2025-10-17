import React, { useEffect, useRef } from 'react';
import { Flower2, Truck, Leaf, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

const malaBannerUrl = 'https://images.unsplash.com/photo-1596315450055-c7b1f8f57024?q=80&w=1200&auto=format&fit=crop';

const MalaPage = () => {
    const { language } = useLanguage();
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
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">{t('mala.title', language)}</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow font-devanagari">{t('mala.subtitle', language)}</h2>
                    <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto font-sanskrit italic">"पुष्पं पत्रं फलं तोयं यो मे भक्त्या प्रयच्छति"</p>
                    <button onClick={goToBooking} className="mt-8 inline-block bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        {language === 'hi' ? 'अभी सब्सक्राइब/बुक करें' : 'Subscribe/Book Now'}
                    </button>
                </div>
            </header>

            {/* Intro */}
            <section ref={introRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mala-intro max-w-4xl mx-auto bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] p-8 rounded-2xl shadow-lg">
                        <div className="flex items-start gap-4 mb-4">
                            <Flower2 className="w-10 h-10 text-[#FFB300]" />
                            <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">{t('mala.importance', language)}</h3>
                        </div>
                        <div className="space-y-3 text-lg font-devanagari">
                            <p>{t('mala.importanceDesc', language)}</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>{t('mala.benefit1', language)}</li>
                                <li>{t('mala.benefit2', language)}</li>
                                <li>{t('mala.benefit3', language)}</li>
                                <li>{t('mala.benefit4', language)}</li>
                            </ul>
                            <p className="mt-4">{t('mala.dailyBenefit', language)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section ref={benefitsRef} className="py-16 md:py-20 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">{t('mala.ourService', language)}</h3>
                        <p className="text-[#424242] font-devanagari">{t('mala.serviceDesc', language)}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><Sparkles size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">{t('mala.freshMorning', language)}</p>
                        </div>
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><Truck size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">{t('mala.doorstepDelivery', language)}</p>
                        </div>
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><Leaf size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">{t('mala.ecoPackaging', language)}</p>
                        </div>
                        <div className="mala-benefit flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white">
                            <span className="text-4xl mb-4 text-[#FFB300] p-4 bg-[#FAFAFA] rounded-full"><CheckCircle size={48} /></span>
                            <p className="text-lg font-medium text-[#424242] font-devanagari">{t('mala.flexibleSubscription', language)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans & Pricing */}
            <section ref={plansRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif">{t('mala.plansTitle', language)}</h3>
                        <p className="text-[#424242] font-devanagari">{t('mala.plansDesc', language)}</p>
                    </div>
                    <div className="max-w-3xl mx-auto mala-plan p-8 rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[#1B5E20] font-serif mb-2">{t('mala.monthlyPlan', language)}</div>
                                <ul className="list-disc pl-6 space-y-1 text-lg text-[#424242] font-devanagari">
                                    <li>{t('mala.monthlyPrice', language)}</li>
                                    <li>{t('mala.dailyItems', language)}</li>
                                    <li>{t('mala.homeDelivery', language)}</li>
                                </ul>
                            </div>
                            <div className="text-center md:text-right">
                                <div className="text-4xl font-extrabold text-[#1B5E20]">₹600</div>
                                <div className="text-sm text-[#424242] opacity-80 font-devanagari">{t('mala.duration', language)}</div>
                                <button onClick={goToBooking} className="mt-4 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-6 py-2 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-md font-devanagari">
{t('mala.subscribe', language)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section ref={howItWorksRef} className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-8">{t('mala.howItWorks', language)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="mala-step p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4">1</div>
                            <p className="text-lg font-medium font-devanagari">{t('mala.step1', language)}</p>
                        </div>
                        <div className="mala-step p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4">2</div>
                            <p className="text-lg font-medium font-devanagari">{t('mala.step2', language)}</p>
                        </div>
                        <div className="mala-step p-6 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl shadow-lg">
                            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white text-2xl font-bold flex items-center justify-center mb-4">3</div>
                            <p className="text-lg font-medium font-devanagari">{t('mala.step3', language)}</p>
                        </div>
                    </div>
                    <button onClick={goToBooking} className="mt-12 bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
{t('mala.bookService', language)}
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


