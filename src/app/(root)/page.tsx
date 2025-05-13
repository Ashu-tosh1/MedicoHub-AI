import CardInfoSection from '@/Components/Homepage/CardInfoSection'
import ContentSection from '@/Components/Homepage/ContentSection'
import Footer from '@/Components/Homepage/Footer'
import HeroSection from '@/Components/Homepage/HeroSection'
import Navbar from '@/Components/Homepage/Navbar'
import SliderSection from '@/Components/Homepage/SliderSection'
import React from 'react'

const page = () => {
  return (
      <div>
      <Navbar/>
      <HeroSection/>
      <ContentSection/>
      <CardInfoSection/>
      <SliderSection/>
      <Footer/>
          
    </div>
  )
}

export default page