"use client";

import Link from 'next/link';
import { Calendar, UserRound, FileText, Stethoscope, Brain, Video, History, FileBarChart, Pill,  } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="text-blue-600 font-semibold mb-3">Advanced Healthcare Solutions</h5>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Your Health Is Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Priority</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience top-quality healthcare services with compassionate care powered by cutting-edge AI technology.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/patient/symptomchecker"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-8 py-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center gap-2 transform hover:scale-105"
              >
                <Brain size={20} />
                AI Symptom Checker
              </Link>
             
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium px-8 py-4 rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg flex items-center gap-2 transform hover:scale-105">
              <Video size={20} />
              Video Call Doctor
              </div>
                
             
               
              
            </div>

           
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main graphic */}
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-200 to-indigo-100 shadow-xl overflow-hidden p-6 relative">
              <div className="absolute top-6 right-6 bg-white p-3 rounded-full shadow-lg">
                <Stethoscope className="text-blue-600 w-6 h-6" />
              </div>
              
              {/* Video call doctor UI */}
              <div className="absolute top-20 right-6 bg-white p-3 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Video className="text-white w-4 h-4" />
                  </div>
                 
                </div>
              </div>
              
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Advanced AI Diagnosis</h3>
                  <p className="text-gray-600">Get preliminary diagnosis in minutes with our AI technology</p>
                </div>
              </div>
              
       
            </div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <FeatureCard 
            icon={<Calendar />}
            title="Book an Appointment"
            description="Schedule your visit with our specialists online."
            
            delay={0.1}
          />
          <FeatureCard 
            icon={<UserRound />}
            title="Find a Doctor"
            description="Search for specialists based on your needs."
                        delay={0.2}
          />
          <FeatureCard 
            icon={<History />}
            title="Medical History"
            description="Access and manage your complete medical history."
            
            delay={0.3}
          />
          <FeatureCard 
            icon={<Brain />}
            title="Symptom Generator"
            description="Generate a report based on your symptoms."
            
            delay={0.4}
          />
          <FeatureCard 
            icon={<FileText />}
            title="Doctor Reports"
            description="Review your medical records and doctor notes."
           
            delay={0.5}
          />
          <FeatureCard 
            icon={<Pill />}
            title="Pharmacy"
            description="Order medications online with home delivery."
            
            delay={0.6}
          />
        </div>
        
        {/* Video Call UI Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
            <h3 className="text-2xl font-bold">Connect with a Doctor</h3>
            <p className="opacity-80">Get expert medical advice through secure video consultation</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Video className="text-emerald-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Video Consultation</h4>
                    <p className="text-sm text-gray-500">Face-to-face care</p>
                  </div>
                </div>
                
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Schedule a Call</h4>
                    <p className="text-sm text-gray-500">Book in advance</p>
                  </div>
                </div>
                
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FileBarChart className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Follow-up Care</h4>
                    <p className="text-sm text-gray-500">Continuous support</p>
                  </div>
                </div>
                
              </div>
            </div>
            

          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  
  delay: number;
}

const FeatureCard = ({ icon, title, description,  delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 group"
    >
  
        <div className="text-blue-600 mb-4 inline-flex p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{title}</h3>
        <p className="text-gray-600">{description}</p>
       
   
    </motion.div>
  );
};

export default HeroSection;