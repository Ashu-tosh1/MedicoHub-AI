// app/api/medicines/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch medicines and join with inventory to get prices
    const medicines = await prisma.medicine.findMany({
      include: {
        inventoryItems: {
          orderBy: {
            expiryDate: 'desc',
          },
          take: 1,
        },
      },
    });

    // Map and transform the data to include price from inventory
    const transformedMedicines = medicines.map(medicine => ({
      id: medicine.id,
      name: medicine.name,
      genericName: medicine.genericName,
      manufacturer: medicine.manufacturer,
      category: medicine.category,
      description: medicine.description,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      // Get price from the first inventory item if available
      price: medicine.inventoryItems.length > 0 
        ? medicine.inventoryItems[0].price 
        : null,
    }));

    return NextResponse.json(transformedMedicines);
  } catch (error) {
    console.error("Failed to fetch medicines:", error);
    return NextResponse.json(
      { error: "Failed to fetch medicines" },
      { status: 500 }
    );
  }
}