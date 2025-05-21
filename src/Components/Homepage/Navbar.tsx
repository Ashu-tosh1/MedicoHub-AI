"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ActivitySquare } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/patient/dashboard' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Doctors', href: '/patient/doctors' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">

          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md">
                <ActivitySquare size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                MedicoHub
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors group py-2"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/appointment"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-cyan-500 transition-colors duration-300 shadow-md flex items-center justify-center"
            >
              Book Appointment
            </Link>
            
            <SignOutButton redirectUrl="/login">
              <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded-full shadow-md transition duration-300 flex items-center justify-center">
                Logout
              </button>
            </SignOutButton>
          </div>

          
          <div className="md:hidden flex items-center space-x-4">
            <SignOutButton redirectUrl="/login">
              <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 rounded-full shadow-md transition duration-300">
                <X size={16} />
              </button>
            </SignOutButton>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-2 rounded-full bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/appointment"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-cyan-500 transition-colors text-center mt-2 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;