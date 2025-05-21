import Navbar from '@/Components/Homepage/Navbar'
import VideoCalls from '@/Components/VideoCall/VideoCall'
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
   <VideoCalls/>
 </div>
         
   </div>
  )
}

export default page