"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    // { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' },
    { name: 'Support', path: '/support' },
];

export const NavLinks = ({ onClick }) => {
    const pathname = usePathname();

    return (
        <>
            {NAV_ITEMS.map((link) => {
                const isActive = pathname === link.path;
                
                return (
                    <Link
                        key={link.name}
                        href={link.path}
                        onClick={onClick}
                        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            isActive
                                ? 'text-gray-900 bg-blue-50 border border-blue-100/50 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                        }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </>
    );
};