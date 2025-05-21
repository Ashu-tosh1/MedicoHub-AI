// // import CardInfoSection from '@/Components/Homepage/CardInfoSection'
// import ContentSection from '@/Components/Homepage/ContentSection'
// import Footer from '@/Components/Homepage/Footer'
// import HeroSection from '@/Components/Homepage/HeroSection'
// import Navbar from '@/Components/Homepage/Navbar'
// // import { requireAuth } from '@/lib/auth'
// import { SignedIn } from '@clerk/nextjs'
// import React from 'react'

// const  page = async () => {

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   // const { user, role } = await requireAuth();
//   // console.log("Role:", role);

 

//   // if (role !== "patient") {
//   //   return <div className="text-red-500">Unauthorized: You are not a patient.</div>;
//   // }

//   return (
//     <SignedIn>

  
//     <div>
      
//       <Navbar/>
//       <HeroSection/>
//       <ContentSection/>
//       {/* <CardInfoSection/>
//       <SliderSection/> */}
//       <Footer/>
          
//       </div>
//       </SignedIn>
//   )
// }

// export default page

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
