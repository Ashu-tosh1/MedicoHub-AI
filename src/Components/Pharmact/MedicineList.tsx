// components/medicine/MedicineList.tsx
// import { Medicine } from "@/types/medicine";
import { Medicine } from "@/lib/mockData";
import MedicineCard from "./MedicineCard";
// import MedicineCard from "./MedicineCard";

interface MedicineListProps {
  medicines: Medicine[];
  prescribedMedicineIds: string[];
  onAddToCart: (medicine: Medicine) => void;
  isLoading: boolean;
}

export default function MedicineList({ 
  medicines, 
  prescribedMedicineIds, 
  onAddToCart, 
  isLoading 
}: MedicineListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No medicines found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          medicine={medicine}
          isPrescribed={prescribedMedicineIds.includes(medicine.id)}
          onAddToCart={() => onAddToCart(medicine)}
        />
      ))}
    </div>
  );
}