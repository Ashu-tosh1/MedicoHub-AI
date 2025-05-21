/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, UserRound, Clock, FileText, Video, FileCheck, Stethoscope, Pill } from 'lucide-react';

const ContentSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Healthcare <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Journey</span> With Us
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Experience seamless healthcare from appointment booking to medication delivery through our integrated digital platform.
          </p>
        </motion.div>

        {/* Process Flow */}
        <div className="relative mb-16">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <ProcessStep 
              icon={<UserRound className="w-8 h-8" />}
              title="Find Your Doctor"
              description="Search and filter specialists based on your medical needs, and availability."
              color="blue"
              delay={0.1}
              number={1}
            />
            
            {/* Step 2 */}
            <ProcessStep 
              icon={<Calendar className="w-8 h-8" />}
              title="Book Appointment"
              description="Select a convenient time slot and book your appointment with just a few clicks."
              color="indigo"
              delay={0.2}
              number={2}
            />
            
            {/* Step 3 */}
            <ProcessStep 
              icon={<Video className="w-8 h-8" />}
              title="Video Consultation"
              description="Connect with your doctor through our secure video platform for your consultation."
              color="purple"
              delay={0.3}
              number={3}
            />
            
            {/* Step 4 */}
            <ProcessStep 
              icon={<Pill className="w-8 h-8" />}
              title="Receive Treatment"
              description="Get your prescription, order medication, and access your treatment plan online."
              color="emerald"
              delay={0.4}
              number={4}
            />
          </div>
        </div>

        {/* Detailed Process */}
        <div className="grid grid-cols-1 gap-24">
          {/* Section 1: Find Doctor & Book Appointment */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Finding a Doctor & <span className="text-blue-600">Booking Your Appointment</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Our intuitive platform makes it easy to find the right specialist and schedule your appointment in just a few simple steps.
                </p>

                <div className="space-y-6">
                  <DetailedStep 
                    number="01"
                    title="Search For Specialists" 
                    description="Filter doctors by specialty to find the perfect match for your healthcare needs."
                    icon={<UserRound className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="02"
                    title="Book Your Preferred Time" 
                    description="View available time slots and select one that works with your schedule. "
                    icon={<Calendar className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="03"
                    title="Wait For Confirmation" 
                    description="The doctor will review your booking and confirm the appointment."
                    icon={<Clock className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="04"
                    title="Upload Symptoms & Notes" 
                    description="Before your appointment, share your symptoms, medical history, and any relevant notes to help your doctor prepare."
                    icon={<FileText className="w-5 h-5" />}
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="w-full md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/FindandBook.png" 
                  alt="Doctor search and appointment booking interface" 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
                
                {/* UI Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-xs">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserRound className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Dr. Ashutosh Patro</h4>
                        <p className="text-sm text-gray-500">Cardiologist</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <p className="text-xs text-gray-500">Next Available</p>
                        <p className="font-medium text-gray-900">Today, 3:00 PM</p>
                      </div>
                      
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Section 2: Consultation & Tests */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/Videocall.png" 
                  alt="Doctor video consultation interface" 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
                
                {/* UI Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="bg-white rounded-xl p-4 shadow-lg w-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Video className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Video Call</h4>
                          <p className="text-xs text-gray-500">Connection secure</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900">15:42</p>
                      </div>
                    </div>
                   
                    <div className="flex justify-between">
                      <button className="bg-red-100 text-red-600 p-2 rounded-lg">
                        End Call
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Video Consultation & <span className="text-purple-600">Test Recommendations</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Connect with your doctor through our secure platform for a face-to-face consultation and receive personalized test recommendations.
                </p>
                
                <div className="space-y-6">
                  <DetailedStep 
                    number="05"
                    title="Join Video Consultation" 
                    description="Connect with your doctor through our secure HD video platform. Discuss your symptoms and receive medical advice."
                    icon={<Video className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="06"
                    title="Doctor Examination" 
                    description="Your doctor will examine you virtually, ask questions about your symptoms, and review your medical history."
                    icon={<Stethoscope className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="07"
                    title="Receive Test Recommendations" 
                    description="Based on your consultation, your doctor may recommend specific laboratory tests or imaging studies."
                    icon={<FileText className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="08"
                    title="Upload Test Results" 
                    description="Once you've completed your tests, easily upload the results through our secure platform for your doctor to review."
                    icon={<FileCheck className="w-5 h-5" />}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Section 3: Treatment & Medication */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Analysis & <span className="text-emerald-600">Treatment Plan</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Your doctor will analyze your test results and provide a comprehensive treatment plan, including medication that can be ordered directly through our pharmacy.
                </p>
                
                <div className="space-y-6">
                  <DetailedStep 
                    number="09"
                    title="Doctor Analyzes Results" 
                    description="Your doctor will review your test results and analyze them in the context of your medical history and symptoms."
                    icon={<FileCheck className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="10"
                    title="Diagnosis & Treatment Plan" 
                    description="Receive a comprehensive diagnosis and personalized treatment plan addressing your specific health concerns."
                    icon={<Stethoscope className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="11"
                    title="Medication Prescription" 
                    description="Your doctor will prescribe appropriate medications based on your diagnosis, which are electronically sent to our pharmacy."
                    icon={<FileText className="w-5 h-5" />}
                  />
                  
                  <DetailedStep 
                    number="12"
                    title="Order Medication" 
                    description="Order your prescribed medication directly through our integrated pharmacy."
                    icon={<Pill className="w-5 h-5" />}
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="w-full md:w-1/2 order-1 md:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/TestReport.png" 
                  alt="Medication and treatment plan interface" 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
                
                {/* UI Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="bg-white rounded-xl p-4 shadow-lg w-full">
                    <h4 className="font-semibold text-gray-900 mb-3">Your Prescription</h4>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Pill className="w-4 h-4 text-blue-600" />
                          </div>
                          <h5 className="font-medium">Lisinopril 10mg</h5>
                        </div>
                        <span className="text-sm text-gray-500">30 tablets</span>
                      </div>
                      <p className="text-sm text-gray-600 pl-10">Take one tablet daily with water</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Pill className="w-4 h-4 text-purple-600" />
                          </div>
                          <h5 className="font-medium">Atorvastatin 20mg</h5>
                        </div>
                        <span className="text-sm text-gray-500">30 tablets</span>
                      </div>
                      <p className="text-sm text-gray-600 pl-10">Take one tablet daily in the evening</p>
                    </div>
                    
                    <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                      <Pill className="w-4 h-4" />
                      Order Medication
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
  number: number;
}

const ProcessStep = ({ icon, title, description, color, delay, number }: ProcessStepProps) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600"
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className={`w-16 h-16 rounded-full ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center relative z-10`}>
        {icon}
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-600">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

interface DetailedStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DetailedStep = ({ number, title, description, icon }: DetailedStepProps) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <div className="flex items-center mb-1">
          <span className="text-sm font-bold text-blue-600 mr-2">{number}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ContentSection;