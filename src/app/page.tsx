
import Navbar from '@/Components/Homepage/Navbar';
import HeroSection from '@/Components/Homepage/HeroSection';
import ContentSection from '@/Components/Homepage/ContentSection';
import Footer from '@/Components/Homepage/Footer';
import { SignedIn } from '@clerk/nextjs';
import { requireAuth } from '@/lib/auth';

const HomePage = async () => {
  // Check authentication and ensure the user has the patient role
  await requireAuth();
  
  return (
    <SignedIn>
      <div>
        <Navbar />
        <HeroSection />
        <ContentSection />
        <Footer />
      </div>
    </SignedIn>
  );
};

export default HomePage;
