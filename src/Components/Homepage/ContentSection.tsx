// components/ContentSection.tsx
"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

const ContentSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Advanced Healthcare <span className="text-blue-600">Solutions</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Our hospital is equipped with state-of-the-art technology and staffed by experienced healthcare professionals dedicated to providing exceptional care to all patients.
              </p>
              <div className="space-y-4">
                <Feature title="Top Medical Specialists" description="Our team includes nationally recognized doctors in various specialties." />
                <Feature title="Modern Equipment" description="We invest in the latest medical technology for accurate diagnosis and treatment." />
                <Feature title="Personalized Care" description="Your treatment plan is customized to your specific health needs and goals." />
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full md:w-1/2 order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/api/placeholder/500/400" 
                alt="Modern hospital facility" 
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-12 mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/api/placeholder/500/400" 
                alt="Doctor consulting with patient" 
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </motion.div>
          
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Patient-First <span className="text-blue-600">Approach</span>
              </h2>
              <p className="text-gray-600 mb-6">
                We believe in a holistic approach to healthcare, addressing not just the physical symptoms but the overall well-being of our patients.
              </p>
              <div className="space-y-4">
                <Feature title="24/7 Emergency Services" description="Our emergency department is open around the clock to provide immediate care when you need it most." />
                <Feature title="Telemedicine Options" description="Connect with our healthcare providers from the comfort of your home via secure video consultations." />
                <Feature title="Preventive Care Programs" description="We offer comprehensive wellness programs designed to keep you healthy and prevent illness." />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface FeatureProps {
  title: string;
  description: string;
}

const Feature = ({ title, description }: FeatureProps) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ContentSection;