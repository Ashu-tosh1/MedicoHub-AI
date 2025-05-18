// components/medicine/MedicineFilters.tsx
interface MedicineFiltersProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
  }
  
  export default function MedicineFilters({
    categories,
    activeCategory,
    onCategoryChange
  }: MedicineFiltersProps) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                block w-full text-left px-3 py-2 rounded-md text-sm transition
                ${activeCategory === category 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100'}
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }