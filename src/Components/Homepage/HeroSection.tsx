// components/HeroSection.tsx
"use client";
// import { useState } from 'react';
import Link from 'next/link';
import { Calendar, UserRound, FileText, Activity, Pill } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Health Is Our <span className="text-blue-600">Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Top-quality healthcare services with compassionate care for you and your family.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/appointment"
              className="bg-blue-600 text-white font-medium px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              Book an Appointment
            </Link>
            <Link 
              href="/services"
              className="bg-white text-blue-600 font-medium px-8 py-3 rounded-full border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Our Services
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard 
            icon={<Calendar />}
            title="Book an Appointment"
            description="Schedule your visit with our specialists online."
            link="/appointment"
            delay={0.1}
          />
          <FeatureCard 
            icon={<UserRound />}
            title="Find a Doctor"
            description="Search for specialists based on your needs."
            link="/doctors"
            delay={0.2}
          />
          <FeatureCard 
            icon={<FileText />}
            title="Lab Reports"
            description="Access your test results securely online."
            link="/lab-reports"
            delay={0.3}
          />
          <FeatureCard 
            icon={<Activity />}
            title="Health Checkups"
            description="Comprehensive health screening packages."
            link="/health-checkups"
            delay={0.4}
          />
          <FeatureCard 
            icon={<FileText />}
            title="Doctor Reports"
            description="Review your medical records and doctor notes."
            link="/doctor-reports"
            delay={0.5}
          />
          <FeatureCard 
            icon={<Pill />}
            title="Pharmacy"
            description="Order medications online with home delivery."
            link="/pharmacy"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, link, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <Link href={link} className="block h-full">
        <div className="text-blue-600 mb-4 inline-flex p-3 bg-blue-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4 text-blue-600 font-medium flex items-center">
          
          {/* <ChevronRight className="ml-1 w-4 h-4" /> */}
        </div>
      </Link>
    </motion.div>
  );
};

// const ChevronRight = ({ className = "" }) => (
//   <svg 
//     className={className} 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <polyline points="9 18 15 12 9 6"></polyline>
//   </svg>
// );

export default HeroSection;