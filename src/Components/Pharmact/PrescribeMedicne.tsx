// components/medicine/PrescribedMedicineAlert.tsx
interface PrescribedMedicineAlertProps {
    hasPrescribedMedicines: boolean;
  }
  
  export default function PrescribedMedicineAlert({ 
    hasPrescribedMedicines 
  }: PrescribedMedicineAlertProps) {
    if (!hasPrescribedMedicines) return null;
    
    return (
      <div className="bg-blue-50 ml-[150px] border-l-4 border-blue-500 p-4 mb-6 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm  text-blue-700">
              You have prescribed medications. They are highlighted in blue.
            </p>
          </div>
        </div>
      </div>
    );
  }