import SymptomChecker from '@/Components/Ai/SymptomGenerator'
import Navbar from '@/Components/Homepage/Navbar'
import { requireAuth } from '@/lib/auth';
import React from 'react'

const page = async () => {
  await requireAuth();
  return (

    <div>
     
    <div className="fixed top-0 left-0 w-full z-50">
   <Navbar />
 </div>

 <div className="mt-[54px]"> 
   <SymptomChecker/>
 </div>
         
   </div>
  )
}

export default page