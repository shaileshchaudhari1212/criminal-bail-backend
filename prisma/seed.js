const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding crimes...");

  const defaultCrimes = [
    { name: "Evidence tampering" },
    { name: "Bribery or corruption by police staff" },
    { name: "Custodial violence" },
    { name: "Custody escape of accused person" },
    { name: "FIR manipulation or fake FIR registration" },
    { name: "Theft of seized property from police station" },
    { name: "Data breach or hacking of police records" },
    { name: "Unauthorized release of accused from custody" },
    { name: "Misuse of police resources" },
    { name: "False complaint registration racket" }
  ];

  for (const crime of defaultCrimes) {
    await prisma.crime.upsert({
      where: { name: crime.name },
      update: {},
      create: crime
    });
  }

  console.log("✅ Crime seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
