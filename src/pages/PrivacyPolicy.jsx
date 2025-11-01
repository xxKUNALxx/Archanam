import React, { useEffect, useRef } from 'react';
import { Shield, Lock, Eye, UserCheck, Mail, Phone, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';

const PrivacyPolicy = () => {
    const { language } = useLanguage();
    const pageRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap) {
            window.gsap.fromTo(pageRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <div ref={pageRef} className="bg-gradient-to-b from-white to-[#F5F5F5] text-[#424242] font-sans pt-16">
            {/* Header */}
            <header className="relative w-full py-16 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <button 
                        onClick={() => {
                            window.history.pushState({}, '', '/');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="flex items-center text-white hover:text-[#FFB300] transition-colors mb-8 font-devanagari"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {language === 'hi' ? 'वापस होम' : 'Back to Home'}
                    </button>
                    
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Shield className="w-16 h-16 text-[#FFB300]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">{t('privacy.title', language)}</h1>
                        <p className="text-xl max-w-2xl mx-auto font-devanagari">{t('privacy.subtitle', language)}</p>
                        <p className="text-sm mt-4 opacity-80">{t('privacy.lastUpdated', language)}: {t('privacy.updateDate', language)}</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                
                {/* Introduction */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center mb-6">
                            <UserCheck className="w-8 h-8 text-[#FFB300] mr-3" />
                            <h2 className="text-2xl font-bold text-[#1B5E20] font-serif">{t('privacy.introduction.title', language)}</h2>
                        </div>
                        <p className="text-lg leading-relaxed font-devanagari mb-4">
                            {t('privacy.introduction.content', language)}
                        </p>
                        <p className="text-lg leading-relaxed font-devanagari">
                            {t('privacy.introduction.commitment', language)}
                        </p>
                    </div>
                </section>

                {/* Information We Collect */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center mb-6">
                            <Eye className="w-8 h-8 text-[#FFB300] mr-3" />
                            <h2 className="text-2xl font-bold text-[#1B5E20] font-serif">{t('privacy.collection.title', language)}</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-[#1B5E20] mb-3 font-devanagari">{t('privacy.collection.personal.title', language)}</h3>
                                <ul className="space-y-2 text-gray-700 font-devanagari">
                                    <li className="flex items-start">
                                        <UserCheck className="w-5 h-5 text-[#FFB300] mr-2 mt-0.5 flex-shrink-0" />
                                        {t('privacy.collection.personal.name', language)}
                                    </li>
                                    <li className="flex items-start">
                                        <Phone className="w-5 h-5 text-[#FFB300] mr-2 mt-0.5 flex-shrink-0" />
                                        {t('privacy.collection.personal.phone', language)}
                                    </li>
                                    <li className="flex items-start">
                                        <Mail className="w-5 h-5 text-[#FFB300] mr-2 mt-0.5 flex-shrink-0" />
                                        {t('privacy.collection.personal.email', language)}
                                    </li>
                                    <li className="flex items-start">
                                        <MapPin className="w-5 h-5 text-[#FFB300] mr-2 mt-0.5 flex-shrink-0" />
                                        {t('privacy.collection.personal.address', language)}
                                    </li>
                                    <li className="flex items-start">
                                        <Calendar className="w-5 h-5 text-[#FFB300] mr-2 mt-0.5 flex-shrink-0" />
                                        {t('privacy.collection.personal.birthDetails', language)}
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-[#1B5E20] mb-3 font-devanagari">{t('privacy.collection.service.title', language)}</h3>
                                <ul className="space-y-2 text-gray-700 font-devanagari">
                                    <li>• {t('privacy.collection.service.bookings', language)}</li>
                                    <li>• {t('privacy.collection.service.preferences', language)}</li>
                                    <li>• {t('privacy.collection.service.payments', language)}</li>
                                    <li>• {t('privacy.collection.service.feedback', language)}</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-[#1B5E20] mb-3 font-devanagari">{t('privacy.collection.technical.title', language)}</h3>
                                <ul className="space-y-2 text-gray-700 font-devanagari">
                                    <li>• {t('privacy.collection.technical.ip', language)}</li>
                                    <li>• {t('privacy.collection.technical.browser', language)}</li>
                                    <li>• {t('privacy.collection.technical.device', language)}</li>
                                    <li>• {t('privacy.collection.technical.usage', language)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How We Use Information */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center mb-6">
                            <Lock className="w-8 h-8 text-[#FFB300] mr-3" />
                            <h2 className="text-2xl font-bold text-[#1B5E20] font-serif">{t('privacy.usage.title', language)}</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-[#1B5E20] font-devanagari">{t('privacy.usage.primary.title', language)}</h3>
                                <ul className="space-y-2 text-gray-700 font-devanagari">
                                    <li>• {t('privacy.usage.primary.services', language)}</li>
                                    <li>• {t('privacy.usage.primary.communication', language)}</li>
                                    <li>• {t('privacy.usage.primary.scheduling', language)}</li>
                                    <li>• {t('privacy.usage.primary.payments', language)}</li>
                                </ul>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-[#1B5E20] font-devanagari">{t('privacy.usage.secondary.title', language)}</h3>
                                <ul className="space-y-2 text-gray-700 font-devanagari">
                                    <li>• {t('privacy.usage.secondary.improvement', language)}</li>
                                    <li>• {t('privacy.usage.secondary.support', language)}</li>
                                    <li>• {t('privacy.usage.secondary.marketing', language)}</li>
                                    <li>• {t('privacy.usage.secondary.legal', language)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Protection */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center mb-6">
                            <Shield className="w-8 h-8 text-[#FFB300] mr-3" />
                            <h2 className="text-2xl font-bold text-[#1B5E20] font-serif">{t('privacy.protection.title', language)}</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <p className="text-lg leading-relaxed font-devanagari">
                                {t('privacy.protection.commitment', language)}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-[#F5F5F5] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#1B5E20] mb-3 font-devanagari">{t('privacy.protection.technical.title', language)}</h3>
                                    <ul className="space-y-2 text-gray-700 font-devanagari text-sm">
                                        <li>• {t('privacy.protection.technical.encryption', language)}</li>
                                        <li>• {t('privacy.protection.technical.secure', language)}</li>
                                        <li>• {t('privacy.protection.technical.access', language)}</li>
                                        <li>• {t('privacy.protection.technical.monitoring', language)}</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-[#F5F5F5] rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-[#1B5E20] mb-3 font-devanagari">{t('privacy.protection.organizational.title', language)}</h3>
                                    <ul className="space-y-2 text-gray-700 font-devanagari text-sm">
                                        <li>• {t('privacy.protection.organizational.training', language)}</li>
                                        <li>• {t('privacy.protection.organizational.policies', language)}</li>
                                        <li>• {t('privacy.protection.organizational.audits', language)}</li>
                                        <li>• {t('privacy.protection.organizational.incident', language)}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Your Rights */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <div className="flex items-center mb-6">
                            <UserCheck className="w-8 h-8 text-[#FFB300] mr-3" />
                            <h2 className="text-2xl font-bold text-[#1B5E20] font-serif">{t('privacy.rights.title', language)}</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="border-l-4 border-[#FFB300] pl-4">
                                    <h3 className="font-semibold text-[#1B5E20] font-devanagari">{t('privacy.rights.access.title', language)}</h3>
                                    <p className="text-gray-700 font-devanagari text-sm">{t('privacy.rights.access.desc', language)}</p>
                                </div>
                                
                                <div className="border-l-4 border-[#FFB300] pl-4">
                                    <h3 className="font-semibold text-[#1B5E20] font-devanagari">{t('privacy.rights.correct.title', language)}</h3>
                                    <p className="text-gray-700 font-devanagari text-sm">{t('privacy.rights.correct.desc', language)}</p>
                                </div>
                                
                                <div className="border-l-4 border-[#FFB300] pl-4">
                                    <h3 className="font-semibold text-[#1B5E20] font-devanagari">{t('privacy.rights.delete.title', language)}</h3>
                                    <p className="text-gray-700 font-devanagari text-sm">{t('privacy.rights.delete.desc', language)}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="border-l-4 border-[#FFB300] pl-4">
                                    <h3 className="font-semibold text-[#1B5E20] font-devanagari">{t('privacy.rights.restrict.title', language)}</h3>
                                    <p className="text-gray-700 font-devanagari text-sm">{t('privacy.rights.restrict.desc', language)}</p>
                                </div>
                                
                                <div className="border-l-4 border-[#FFB300] pl-4">
                                    <h3 className="font-semibold text-[#1B5E20] font-devanagari">{t('privacy.rights.portability.title', language)}</h3>
                                    <p className="text-gray-700 font-devanagari text-sm">{t('privacy.rights.portability.desc', language)}</p>
                                </div>
                                
                                <div className="border-l-4 border-[#FFB300] pl-4">
                                    <h3 className="font-semibold text-[#1B5E20] font-devanagari">{t('privacy.rights.withdraw.title', language)}</h3>
                                    <p className="text-gray-700 font-devanagari text-sm">{t('privacy.rights.withdraw.desc', language)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-2xl shadow-lg p-8 text-white">
                        <div className="flex items-center mb-6">
                            <Mail className="w-8 h-8 text-[#FFB300] mr-3" />
                            <h2 className="text-2xl font-bold font-serif">{t('privacy.contact.title', language)}</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-lg mb-4 font-devanagari">{t('privacy.contact.desc', language)}</p>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-[#FFB300] mr-3" />
                                        <span className="font-devanagari">help.archnam@gmail.com</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-[#FFB300] mr-3" />
                                        <span className="font-devanagari">+91 9458090609</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 text-[#FFB300] mr-3" />
                                        <span className="font-devanagari">{t('home.location', language)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-3 font-devanagari">{t('privacy.contact.response.title', language)}</h3>
                                <p className="text-sm opacity-90 font-devanagari">{t('privacy.contact.response.time', language)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Updates */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        <h2 className="text-2xl font-bold text-[#1B5E20] mb-4 font-serif">{t('privacy.updates.title', language)}</h2>
                        <p className="text-lg leading-relaxed font-devanagari mb-4">
                            {t('privacy.updates.content', language)}
                        </p>
                        <p className="text-sm text-gray-600 font-devanagari">
                            {t('privacy.updates.notification', language)}
                        </p>
                    </div>
                </section>

            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
                
                .font-devanagari {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                }
                
                .font-serif {
                    font-family: 'Noto Serif Devanagari', serif;
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;