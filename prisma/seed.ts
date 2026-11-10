import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Purging old databases and seeding clean e-HCMS records...");
  
  // Wipe existing tables to prevent duplicate key constraint exceptions
  await prisma.user.deleteMany({});

  const today = new Date();

  // 1. Seed Personas: 90 Days Notice Threshold
  const user1 = await prisma.user.create({
    data: {
      email: "caleb.guthonda@foreignaffairs.go.ke",
      fullName: "Hon. Caleb Guthonda",
      role: "HONORARY_CONSUL",
      consulProfile: {
        create: {
          fullName: "Hon. Caleb Guthonda",
          dateOfAppointment: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
          contractEndDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), // Exactly 90 days from now
          citiesOfOperation: "Geneva, Zurich",
          jurisdictions: "Switzerland Post",
        },
      },
    },
  });

  // 2. Seed Personas: 60 Days Notice Threshold
  const user2 = await prisma.user.create({
    data: {
      email: "mercy.njeri@foreignaffairs.go.ke",
      fullName: "Hon. Mercy Njeri",
      role: "HONORARY_CONSUL",
      consulProfile: {
        create: {
          fullName: "Hon. Mercy Njeri",
          dateOfAppointment: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
          contractEndDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), // Exactly 60 days from now
          citiesOfOperation: "Zurich",
          jurisdictions: "Swiss Border Mission",
        },
      },
    },
  });

  // 3. Seed Personas: 30 Days Critical Threshold
  const user3 = await prisma.user.create({
    data: {
      email: "blessed.kihika@foreignaffairs.go.ke",
      fullName: "Hon. Blessed Kihika",
      role: "HONORARY_CONSUL",
      consulProfile: {
        create: {
          fullName: "Hon. Blessed Kihika",
          dateOfAppointment: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
          contractEndDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // Exactly 30 days from now
          citiesOfOperation: "Berne",
          jurisdictions: "Central Jurisdiction",
        },
      },
    },
  });

  console.log("Prisma data database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding operational error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
