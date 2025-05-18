/* eslint-disable @typescript-eslint/no-explicit-any */
// app/medicine-shop/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Medicine, CartItem } from "@/lib/mockData" 
import PrescribedMedicineAlert from "@/Components/Pharmact/PrescribeMedicne";
import MedicineFilters from "@/Components/Pharmact/MedicineFilter";
import MedicineList from "@/Components/Pharmact/MedicineList";
import MedicineCart from "@/Components/Pharmact/MedicineCart";
import PatientSidebar from "@/Components/Patient/PatientSidebar";

export default function MedicineShopPage() {
  const { user } = useUser();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescribedMedicines, setPrescribedMedicines] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/medicines");
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error("Failed to fetch medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPrescribedMedicines = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/patient/prescriptions?userId=${user.id}`);
        const data = await response.json();
        
        // Extract medicine IDs from prescriptions
        const medicineIds = data.flatMap((prescription: { medications: any[]; }) => 
          prescription.medications.map(med => med.medicineId)
        );
        
        setPrescribedMedicines(medicineIds);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    };

    fetchMedicines();
    fetchPrescribedMedicines();
  }, [user?.id]);

  const addToCart = (medicine: Medicine) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.medicine.id === medicine.id);
      
      if (existingItem) {
        return prev.map(item => 
          item.medicine.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { medicine, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCartItems(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.medicine.id === medicineId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const filteredMedicines = categoryFilter === "all" 
    ? medicines 
    : medicines.filter(med => med.category === categoryFilter);

    const categories = [
        "all",
        ...Array.from(
          new Set(
            medicines
              .map((med) => med.category)
              .filter((cat): cat is string => typeof cat === "string")
          )
        ),
      ];
      


    return (
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Medicine Shop</h1>
      
          <PrescribedMedicineAlert 
            hasPrescribedMedicines={prescribedMedicines.length > 0} 
          />
      
          {/* Main layout grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Sidebar Placeholder */}
           
            
              {/* <div className="h-full w-full bg-gray-100 p-4 rounded-lg shadow-sm"> */}
                <div className="mr-[40px]">
                <PatientSidebar/>
                </div>      
            
              {/* </div> */}
           
      
            {/* Filters */}
            <div className="md:col-span-1">
              <MedicineFilters 
                categories={categories} 
                activeCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />
            </div>
      
            {/* Medicine List */}
            <div className="md:col-span-2">
              <MedicineList 
                medicines={filteredMedicines}
                prescribedMedicineIds={prescribedMedicines}
                onAddToCart={addToCart}
                isLoading={isLoading}
              />
            </div>
      
            {/* Cart */}
            <div className="md:col-span-1">
              <MedicineCart 
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                userId={user?.id || ""}
              />
            </div>
          </div>
        </div>
      );
      
}