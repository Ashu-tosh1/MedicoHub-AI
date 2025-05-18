import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const medicines = [
    {
      name: "Paracetamol",
      genericName: "Acetaminophen",
      manufacturer: "PharmaCorp",
      category: "Pain Relief",
      description: "Used for relieving mild to moderate pain and reducing fever.",
      dosageForm: "Tablet",
      strength: "500mg",
    },
    {
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      manufacturer: "HealWell",
      category: "Antibiotic",
      description: "Used to treat various bacterial infections.",
      dosageForm: "Capsule",
      strength: "250mg",
    },
    {
      name: "Cetirizine",
      genericName: "Cetirizine Hydrochloride",
      manufacturer: "AllergyFree",
      category: "Antihistamine",
      description: "Used for allergy relief.",
      dosageForm: "Tablet",
      strength: "10mg",
    },
    {
      name: "Omeprazole",
      genericName: "Omeprazole",
      manufacturer: "DigestCare",
      category: "Antacid",
      description: "Used to reduce stomach acid.",
      dosageForm: "Capsule",
      strength: "20mg",
    },
    {
      name: "Metformin",
      genericName: "Metformin Hydrochloride",
      manufacturer: "DiabetX",
      category: "Antidiabetic",
      description: "Used to treat type 2 diabetes.",
      dosageForm: "Tablet",
      strength: "500mg",
    },
    {
      name: "Azithromycin",
      genericName: "Azithromycin",
      manufacturer: "BactiKill",
      category: "Antibiotic",
      description: "Used to treat a variety of bacterial infections.",
      dosageForm: "Tablet",
      strength: "250mg",
    },
    {
      name: "Ibuprofen",
      genericName: "Ibuprofen",
      manufacturer: "ReliefX",
      category: "Pain Relief",
      description: "Used to reduce fever and treat pain or inflammation.",
      dosageForm: "Tablet",
      strength: "400mg",
    },
    {
      name: "Loratadine",
      genericName: "Loratadine",
      manufacturer: "ClearAir",
      category: "Antihistamine",
      description: "Used for allergy symptoms relief.",
      dosageForm: "Tablet",
      strength: "10mg",
    },
    {
      name: "Salbutamol",
      genericName: "Albuterol",
      manufacturer: "BreathEasy",
      category: "Bronchodilator",
      description: "Used for asthma and other breathing conditions.",
      dosageForm: "Inhaler",
      strength: "100mcg",
    },
    {
      name: "Pantoprazole",
      genericName: "Pantoprazole Sodium",
      manufacturer: "AcidGone",
      category: "Antacid",
      description: "Used to treat gastroesophageal reflux disease (GERD).",
      dosageForm: "Tablet",
      strength: "40mg",
    },
  ];

  for (const med of medicines) {
    const createdMedicine = await prisma.medicine.create({
      data: {
        ...med,
        inventoryItems: {
          create: {
            batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`,
            quantity: Math.floor(Math.random() * 500) + 50,
            expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            price: parseFloat((Math.random() * 10 + 5).toFixed(2)),
          },
        },
      },
    });

    console.log(`Created medicine: ${createdMedicine.name}`);
  }
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
