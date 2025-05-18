/* eslint-disable @typescript-eslint/no-unused-vars */
// components/medicine/MedicineCart.tsx
import { CartItem } from "@/lib/mockData";
import { useState } from "react";
// import { CartItem } from "@/types/medicine";

interface MedicineCartProps {
  items: CartItem[];
  onUpdateQuantity: (medicineId: string, quantity: number) => void;
  onRemoveItem: (medicineId: string) => void;
  userId: string;
}

export default function MedicineCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  userId
}: MedicineCartProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const totalAmount = items.reduce(
    (total, item) => total + (item.medicine.price || 0) * item.quantity,
    0
  );

  const handleSubmitOrder = async () => {
    if (!userId) {
      setMessage({ 
        text: "Please log in to place an order", 
        type: "error" 
      });
      return;
    }

    if (items.length === 0) {
      setMessage({ 
        text: "Your cart is empty", 
        type: "error" 
      });
      return;
    }

    if (!address || !phoneNumber) {
      setMessage({ 
        text: "Please provide delivery address and phone number", 
        type: "error" 
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items,
          address,
          phoneNumber,
          totalAmount
        }),
      });

      if (response.ok) {
        setMessage({ 
          text: "Order placed successfully!", 
          type: "success" 
        });
        // Clear cart items here if needed
      } else {
        const error = await response.json();
        setMessage({ 
          text: error.message || "Failed to place order", 
          type: "error" 
        });
      }
    } catch (error) {
      setMessage({ 
        text: "An error occurred while placing order", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Your Cart</h3>
      
      {items.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.medicine.id} 
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <h4 className="font-medium">{item.medicine.name}</h4>
                <p className="text-sm text-gray-500">
                ₹{(item.medicine.price || 0).toFixed(2)} each
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => 
                    onUpdateQuantity(
                      item.medicine.id, 
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded"
                >
                  -
                </button>
                
                <span className="text-sm">{item.quantity}</span>
                
                <button
                  onClick={() => 
                    onUpdateQuantity(
                      item.medicine.id, 
                      item.quantity + 1
                    )
                  }
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded"
                >
                  +
                </button>
                
                <button
                  onClick={() => onRemoveItem(item.medicine.id)}
                  className="ml-2 text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-lg">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Enter your address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            
            {message.text && (
              <div className={`p-2 rounded-md mb-3 text-sm ${
                message.type === "error" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-green-100 text-green-700"
              }`}>
                {message.text}
              </div>
            )}
            
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}