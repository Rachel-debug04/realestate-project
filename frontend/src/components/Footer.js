import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F4C81] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
                EasyMortgage
              </span>
            </div>
            <p className="text-[#A9CCE3] max-w-md">
              Making mortgage discovery, pre-qualification, and application fast, transparent, and emotionally intelligent.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/advisor" className="text-[#A9CCE3] hover:text-white transition-colors duration-200">
                  AI Advisor
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#A9CCE3] hover:text-white transition-colors duration-200">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/prequal" className="text-[#A9CCE3] hover:text-white transition-colors duration-200">
                  Pre-Qualification
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#A9CCE3] hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A9CCE3] hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A9CCE3] hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A6F9E] mt-8 pt-8 text-center text-[#A9CCE3]">
          <p>&copy; {new Date().getFullYear()} EasyMortgage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}