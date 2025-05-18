import { Medicine } from "@/lib/mockData";
import { Pill } from "lucide-react"; // Icon for visual flair

interface MedicineCardProps {
  medicine: Medicine;
  isPrescribed: boolean;
  onAddToCart: () => void;
}

export default function MedicineCard({
  medicine,
  isPrescribed,
  onAddToCart,
}: MedicineCardProps) {
  const {
    name,
    genericName,
    manufacturer,
    dosageForm,
    strength,
    price,
  } = medicine;

  return (
    <div className={`
      relative bg-white/70 border border-gray-200 rounded-3xl shadow-lg
      backdrop-blur-md p-5 w-full max-w-sm transition-all duration-300
      hover:shadow-2xl hover:-translate-y-1 flex flex-col
    `}>
      {/* Prescribed Tag */}
      {isPrescribed && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full font-semibold shadow-md">
            Prescribed
          </span>
        </div>
      )}

      {/* Icon / Thumbnail */}
      <div className="flex justify-center mb-4 text-blue-600">
        <Pill size={40} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500 italic">{genericName}</p>
      </div>

      {/* Medicine Details */}
      <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-700 mb-5">
        {manufacturer && (
          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
            Manufacturer: {manufacturer}
          </span>
        )}
        {dosageForm && (
          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
            Form: {dosageForm}
          </span>
        )}
        {strength && (
          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
            Strength: {strength}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-full font-semibold text-sm shadow">
          ₹{(price || 0).toFixed(2)}
        </span>
        <button
          onClick={onAddToCart}
          className={`px-4 py-2 rounded-full text-sm font-medium transition
            ${isPrescribed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-800 hover:bg-black text-white'}
          `}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
