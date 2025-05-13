// components/CardInfoSection.tsx
"use client";
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Calendar, Heart, Stethoscope } from 'lucide-react';

const CardInfoSection = () => {
  const infoCards = [
    {
      id: 1,
      title: 'Emergency Care',
      icon: <Heart className="w-12 h-12 text-white" />,
      description: '24/7 emergency services for critical medical situations.',
      color: 'bg-red-500',
    },
    {
      id: 2,
      title: 'Doctor Consultations',
      icon: <Stethoscope className="w-12 h-12 text-white" />,
      description: 'Schedule appointments with our specialists for your health concerns.',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      title: 'Medical Tests',
      icon: <Flask className="w-12 h-12 text-white" />,
      description: 'Comprehensive diagnostic tests with quick and accurate results.',
      color: 'bg-green-500',
    },
    {
      id: 4,
      title: 'Pharmacy Services',
      icon: <Pill className="w-12 h-12 text-white" />,
      description: 'In-house pharmacy with prescription and over-the-counter medications.',
      color: 'bg-purple-500',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Our <span className="text-blue-600">Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of medical services to meet your healthcare needs.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {infoCards.map((card) => (
            <motion.div
              key={card.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              variants={item}
            >
              <div className={`${card.color} p-6 flex justify-center`}>
                {card.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 bg-gray-50 rounded-2xl p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoItem 
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              title="Working Hours"
              content={<>
                <p>Monday-Friday: 8AM-8PM</p>
                <p>Saturday: 9AM-5PM</p>
                <p>Sunday: 10AM-2PM</p>
              </>}
            />
            <InfoItem 
              icon={<MapPin className="w-6 h-6 text-blue-600" />}
              title="Location"
              content={<>
                <p>123 Medical Center Drive</p>
                <p>Healthcare City, HC 12345</p>
              </>}
            />
            <InfoItem 
              icon={<Phone className="w-6 h-6 text-blue-600" />}
              title="Contact"
              content={<>
                <p>Emergency: (123) 456-7890</p>
                <p>Appointment: (123) 456-7891</p>
              </>}
            />
            <InfoItem 
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              title="Appointments"
              content={<>
                <p>Book online or call us</p>
                <p>24/7 emergency services</p>
              </>}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const InfoItem = ({ icon, title, content }: InfoItemProps) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-4">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
        <div className="text-gray-600 text-sm">{content}</div>
      </div>
    </div>
  );
};

// Additional icon components
const Flask = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 3h6v3H9zM10 6v7.5a4 4 0 0 0 1 2.625l1 1.25a4 4 0 0 0 1-2.625V6z"></path>
    <path d="M7.5 15.5c-.5 0-1.5 1-1.5 3 0 .5 0 3 3 3s3-2.5 3-3c0-2-1-3-1.5-3M14 12h.01"></path>
  </svg>
);

const Pill = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    const Pill = ({ className = "" }) = (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  />
    <path d="m12 2 8 8-8 8-8-8 8-8z" />
    <path d="m9 5 5 5" />
  </svg>
);

export default CardInfoSection;