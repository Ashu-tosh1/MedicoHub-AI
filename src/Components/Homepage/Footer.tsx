// components/Footer.tsx
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MedCare</h3>
            <p className="text-gray-400 mb-4">
              Providing quality healthcare services with compassion and care for over 25 years.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Linkedin size={20} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/services" text="Our Services" />
              <FooterLink href="/doctors" text="Our Doctors" />
              <FooterLink href="/appointment" text="Book Appointment" />
              <FooterLink href="/contact" text="Contact Us" />
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <FooterLink href="/services/emergency" text="Emergency Care" />
              <FooterLink href="/services/cardiology" text="Cardiology" />
              <FooterLink href="/services/neurology" text="Neurology" />
              <FooterLink href="/services/pediatrics" text="Pediatrics" />
              <FooterLink href="/services/orthopedics" text="Orthopedics" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="mr-3 text-blue-400 flex-shrink-0" size={20} />
                <span className="text-gray-400">123 Medical Center Drive, Healthcare City, HC 12345</span>
              </li>
              <li className="flex">
                <Phone className="mr-3 text-blue-400 flex-shrink-0" size={20} />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex">
                <Mail className="mr-3 text-blue-400 flex-shrink-0" size={20} />
                <span className="text-gray-400">info@medcare.com</span>
              </li>
              <li className="flex">
                <Clock className="mr-3 text-blue-400 flex-shrink-0" size={20} />
                <span className="text-gray-400">Mon-Fri: 8AM-8PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-400">© {new Date().getFullYear()} MedCare. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-6">
              <FooterLink href="/privacy" text="Privacy Policy" />
              <FooterLink href="/terms" text="Terms of Service" />
              <FooterLink href="/faq" text="FAQ" />
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  text: string;
}

const FooterLink = ({ href, text }: FooterLinkProps) => {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-blue-400 transition-colors">
        {text}
      </Link>
    </li>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
}

const SocialIcon = ({ icon }: SocialIconProps) => {
  return (
    <a 
      href="#" 
      className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
    >
      {icon}
    </a>
  );
};

export default Footer;