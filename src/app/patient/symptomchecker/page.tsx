import SymptomChecker from '@/Components/Ai/SymptomGenerator'
import React from 'react'

const page = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
      
  
      
      <div className="mt-8">
        <SymptomChecker />
      </div>
    </div>
  )
}

export default page