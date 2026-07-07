import React from 'react';
import { Icon } from '../UI/Icons/Icon';
// import { PRODUCT_CATEGORIES } from '../constants';
import Link from 'next/link';


export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          <div className="space-y-4 col-span-2 md:col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold">GoRevive</h3>
            <p className="text-gray-400">
              Your trusted partner for high-quality refurbished IT assets.
            </p>
            <div className="space-y-2 text-gray-300 text-sm">
                <p>Second Floor, D-161, Okhla Phase I, Okhla Industrial Estate</p>
                <p>New Delhi, Delhi 110020</p>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Products</h4>
            <ul className="mt-4 space-y-2">
              {/* {PRODUCT_CATEGORIES.slice(0, 5).map(category => (
                <li key={category}>
                  <Link href={`/products?category=${encodeURIComponent(category)}`} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {category}
                  </Link>
                </li>
              ))} */}
               <li><Link href="/products" className="text-gray-400 hover:text-white font-semibold">View all...</Link></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white">Our Products</Link></li>
              <li><Link href="/grading" className="text-gray-400 hover:text-white">Grading Parameters</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="text-gray-400 hover:text-white">Return Policy</Link></li>
              <li><Link href="/cancellation-refund" className="text-gray-400 hover:text-white">Cancellation & Refund Policy </Link></li>
              <li><Link href="/warranty-policy" className="text-gray-400 hover:text-white">Warranty Policy </Link></li>
              <li><Link href="/terms-and-conditions" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/data-deletion" className="text-gray-400 hover:text-white">Data Deletion Request</Link></li>
              <li><Link href="/disclaimer" className="text-gray-400 hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Support</h4>
            <div className="mt-4 space-y-3 text-gray-300">
                <p><strong>Phone:</strong> <a href="tel:01142758155" className="hover:text-white">011 4275 8155</a></p>
                <p><strong>Email:</strong> <a href="mailto:support@gorevive.in" className="hover:text-white">support@gorevive.in</a></p>
            </div>
            <div className="flex space-x-4 mt-6">
                <a href="https://www.facebook.com/Goreviveofficial/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><span className="sr-only">Facebook</span><Icon type="facebook" /></a>
                <a href="https://www.instagram.com/gorevive_official/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><span className="sr-only">Instagram</span><Icon type="instagram" /></a>
                <a href="https://www.linkedin.com/company/gorevive-private-limited" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><span className="sr-only">LinkedIn</span><Icon type="linkedin" /></a>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GoRevive Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
