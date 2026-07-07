"use client";

import Link from 'next/link';
import { Icon } from '../UI/Icons/Icon';
import { useCart } from '../Context/CartContext';
// import { Icon } from '../Icon'; // Adjust path as needed
// import { useCart } from '../../contexts/CartContext'; // Adjust path as needed

export const CartNav = () => {
    const { cartCount } = useCart();

    return (
        <Link
            href="/cart"
            className="relative group p-2.5 bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-brand-blue transition-all duration-300 rounded-full hover:bg-white hover:shadow-sm hover:border-gray-200"
            aria-label={`View Cart, ${cartCount} items`}
        >
            <Icon type="shopping-cart" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full text-[10px] font-bold text-green-700  border-amber-200 shadow-sm transition-transform group-hover:scale-110">
                    {cartCount}
                </span>
            )}
        </Link>
    );
};