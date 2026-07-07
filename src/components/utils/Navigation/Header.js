"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '../UI/Icons/Icon'; 
import { AuthNav } from './AuthNav';
import { CartNav } from './CartNav';
import { NavLinks } from './NavLinks';
import { SearchBar } from '../UI/SearchBar';

const CONTACT_LINKS = [
    { href: "tel:01142758155", icon: "phone", text: "011 4275 8155" },
    { href: "mailto:support@gorevive.in", icon: "mail", text: "support@gorevive.in" }
];

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[84px]">
                    
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="https://gorevive.jbbs.in/images/brand_logo.png"
                                alt="GoRevive Logo"
                                className="h-20 transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-x-6 flex-1 justify-end">
                        <nav className="flex items-center space-x-1 mr-2">
                            <NavLinks />
                        </nav>

                        <div className="flex items-center gap-x-5 border-l border-gray-200 pl-6">
                            <CartNav />
                            <AuthNav />
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-3">
                        <CartNav />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2.5 rounded-full text-gray-600 bg-gray-50 border border-gray-100 hover:text-brand-blue hover:bg-white hover:border-gray-200 hover:shadow-sm focus:outline-none transition-all duration-300"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <Icon type="close" className="w-5 h-5" /> : <Icon type="menu" className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-[600px] opacity-100 border-t border-gray-100 shadow-xl' : 'max-h-0 opacity-0'
                } bg-white`}
            >
                <div className="px-5 py-6 space-y-3 flex flex-col">
                    <div className="mb-4">
                        <SearchBar onSearch={() => setIsMenuOpen(false)} />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <NavLinks onClick={() => setIsMenuOpen(false)} />
                    </div>

                    <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col gap-5">
                        <div className="flex flex-col space-y-3">
                            {CONTACT_LINKS.map((contact, index) => (
                                <a key={index} href={contact.href} className="flex items-center p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-all duration-200 group">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-brand-blue mr-4 group-hover:scale-110 transition-transform">
                                        <Icon type={contact.icon} className="w-4 h-4" />
                                    </span>
                                    {contact.text}
                                </a>
                            ))}
                        </div>
                        <div className="pt-2 flex items-center justify-center w-full">
                            <AuthNav />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};