// components/SliderSection.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Patient",
    text: "The care I received at MedCare was exceptional. The doctors were attentive, and the staff made me feel comfortable throughout my treatment.",
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Patient",
    text: "I was impressed by how efficiently everything was handled, from scheduling my appointment to receiving my test results. The doctors explained everything clearly.",
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Patient",
    text: "The telemedicine service was incredibly convenient. I received the same quality of care as an in-person visit without having to leave my home.",
    image: "/api/placeholder/80/80"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Patient",
    text: "The surgery team was phenomenal. They walked me through every step of the procedure, and the follow-up care was thorough and compassionate.",
    image: "/api/placeholder/80/80"
  }
];

const SliderSection = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Calculate how many testimonials to show based on viewport
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3; // Default for SSR
  };
  
  const [visibleCount, setVisibleCount] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    
    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % (testimonials.length - visibleCount + 1));
  }, [ visibleCount]);
  
  useEffect(() => {
    if (!autoplay) return;
  
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
  
    return () => clearInterval(interval);
  }, [autoplay, nextSlide]);
  
  
  
  const prevSlide = () => {
    setCurrent((current - 1 + (testimonials.length - visibleCount + 1)) % (testimonials.length - visibleCount + 1));
  };
  
  const pauseAutoplay = () => setAutoplay(false);
  const resumeAutoplay = () => setAutoplay(true);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            What Our <span className="text-blue-600">Patients Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read testimonials from patients who have experienced our care and services firsthand.
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="overflow-hidden px-4">
            <motion.div 
              className="flex gap-6"
              initial={{ x: 0 }}
              animate={{ x: `calc(-${current * 100}% / ${visibleCount})` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  visibleCount={visibleCount}
                />
              ))}
            </motion.div>
          </div>
          
          <button 
            className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            onClick={() => {
              prevSlide();
              pauseAutoplay();
            }}
            onMouseLeave={resumeAutoplay}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            onClick={() => {
              nextSlide();
              pauseAutoplay();
            }}
            onMouseLeave={resumeAutoplay}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                current === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => {
                setCurrent(index);
                pauseAutoplay();
              }}
              onMouseLeave={resumeAutoplay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
  visibleCount: number;
}

const TestimonialCard = ({ testimonial, visibleCount }: TestimonialCardProps) => {
  return (
    <motion.div 
      className={`flex-shrink-0 bg-white p-8 rounded-xl shadow-md w-full`}
      style={{ width: `calc(100% / ${visibleCount})` }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            width={1}
            height={1}
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-gray-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-600">&quot;{testimonial.text}&quot;</p>
      <div className="mt-4 flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            className="w-5 h-5 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </motion.div>
  );
};

export default SliderSection;