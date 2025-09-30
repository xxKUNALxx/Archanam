import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ onNavigate }) => {
    const { language, toggleLanguage } = useLanguage();
    const navRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap) {
            window.gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
        }
    }, []);

    return (
        <nav ref={navRef} className="fixed top-0 w-full bg-[#1B5E20]/90 backdrop-blur-lg z-50 shadow-xl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate?.({ preventDefault: () => {} }, 'home')}>
                        <img src="/logo.png" alt="अर्चनम्" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#home" onClick={(e)=>onNavigate?.(e,'home')} className="text-white hover:text-[#FFB300] transition-colors duration-300 relative group">
                            होम
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFB300] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <div className="relative">
                            <button onClick={()=>setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-1 text-white hover:text-[#FFB300] transition-colors focus:outline-none">
                                <span>सेवाएं</span>
                                {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-20">
                                    <a href="#nirmalya" onClick={(e)=>onNavigate?.(e,'nirmalya')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5]">निर्माल्य सेवा</a>
                                    <a href="#mala" onClick={(e)=>onNavigate?.(e,'mala')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5]">डेली फूल माला</a>
                                    <a href="#astrology" onClick={(e)=>onNavigate?.(e,'astrology')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5]">ज्योतिष कुंडली</a>
                                    <a href="#pooja" onClick={(e)=>onNavigate?.(e,'pooja')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5]">पूजा सेवाएं</a>
                                    <a href="#ai" onClick={(e)=>onNavigate?.(e,'ai')} className="block px-4 py-2 text-[#424242] hover:bg-[#F5F5F5]">AI मॉड्यूल</a>
                                </div>
                            )}
                        </div>
                        <a href="#about" onClick={(e)=>onNavigate?.(e,'home')} className="text-white hover:text-[#FFB300] transition-colors duration-300 relative group">
                            हमारे बारे में
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFB300] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <a href="#contact" onClick={(e)=>onNavigate?.(e,'home')} className="text-white hover:text-[#FFB300] transition-colors duration-300 relative group">
                            संपर्क करें
                            <span className="absolute bottom-0 left-0 w-0.5 bg-[#FFB300] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                        <button onClick={toggleLanguage} className="text-white hover:text-[#FFB300] transition-colors duration-300 px-3 py-1 rounded-lg border border-white/30">
                            {language === 'hi' ? 'English' : 'हिंदी'}
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={()=>setMobileOpen(!mobileOpen)} className="text-white px-3 py-2 rounded-md border border-white/20">☰</button>
                    </div>
                </div>
                {mobileOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-2 bg-[#1B5E20]/95 rounded-lg p-3 border border-white/10">
                            <a href="#home" onClick={(e)=>{onNavigate?.(e,'home'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">होम</a>
                            <a href="#nirmalya" onClick={(e)=>{onNavigate?.(e,'nirmalya'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">निर्माल्य सेवा</a>
                            <a href="#mala" onClick={(e)=>{onNavigate?.(e,'mala'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">डेली फूल माला</a>
                            <a href="#astrology" onClick={(e)=>{onNavigate?.(e,'astrology'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">ज्योतिष कुंडली</a>
                            <a href="#pooja" onClick={(e)=>{onNavigate?.(e,'pooja'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">पूजा सेवाएं</a>
                            <a href="#ai" onClick={(e)=>{onNavigate?.(e,'ai'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">AI मॉड्यूल</a>
                            <a href="#about" onClick={(e)=>{onNavigate?.(e,'home'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">हमारे बारे में</a>
                            <a href="#contact" onClick={(e)=>{onNavigate?.(e,'home'); setMobileOpen(false);}} className="text-white px-3 py-2 rounded hover:bg-white/10">संपर्क करें</a>
                            <button onClick={toggleLanguage} className="text-white px-3 py-2 rounded border border-white/20 hover:bg-white/10 self-start">{language === 'hi' ? 'English' : 'हिंदी'}</button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;



