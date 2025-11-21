import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // Seed properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        address: "123 Main Street",
        city: "Vancouver",
        province: "BC",
        postalCode: "V6B 1A1",
        latitude: 49.2827,
        longitude: -123.1207,
        listingPrice: 1250000,
        historyScore: "CONFIRMED",
        incidents: {
          create: [
            {
              latitude: 49.2827,
              longitude: -123.1207,
              type: "Homicide",
              date: new Date("2019-03-15"),
              summary:
                "A violent incident occurred at this address resulting in one fatality. The case was investigated by VPD and resulted in criminal charges.",
              sourceUrl: "https://example.com/news/incident-123",
              severity: 5,
            },
          ],
        },
      },
    }),
    prisma.property.create({
      data: {
        address: "456 Oak Avenue",
        city: "Burnaby",
        province: "BC",
        postalCode: "V5H 2N2",
        latitude: 49.2488,
        longitude: -122.9805,
        listingPrice: 980000,
        historyScore: "POSSIBLE",
        incidents: {
          create: [
            {
              latitude: 49.2488,
              longitude: -122.9805,
              type: "Assault",
              date: new Date("2021-08-22"),
              summary:
                "An assault was reported at or near this address. Police attended and the investigation is ongoing.",
              sourceUrl: "https://example.com/news/incident-456",
              severity: 3,
            },
          ],
        },
      },
    }),
    prisma.property.create({
      data: {
        address: "789 Waterfront Drive",
        city: "Vancouver",
        province: "BC",
        postalCode: "V6E 1A2",
        latitude: 49.2871,
        longitude: -123.1139,
        listingPrice: 2150000,
        historyScore: "CLEAN",
      },
    }),
    prisma.property.create({
      data: {
        address: "321 Cedar Lane",
        city: "Richmond",
        province: "BC",
        postalCode: "V6Y 1K8",
        latitude: 49.1666,
        longitude: -123.1336,
        listingPrice: 1450000,
        historyScore: "CLEAN",
      },
    }),
    prisma.property.create({
      data: {
        address: "555 King George Boulevard",
        city: "Surrey",
        province: "BC",
        postalCode: "V3T 2X3",
        latitude: 49.1913,
        longitude: -122.8490,
        listingPrice: 875000,
        historyScore: "CONFIRMED",
        incidents: {
          create: [
            {
              latitude: 49.1913,
              longitude: -122.8490,
              type: "Drug-related",
              date: new Date("2020-11-10"),
              summary:
                "This property was the subject of a drug investigation. Multiple arrests were made on the premises.",
              sourceUrl: "https://example.com/news/incident-555a",
              severity: 4,
            },
            {
              latitude: 49.1913,
              longitude: -122.8490,
              type: "Weapons offense",
              date: new Date("2018-05-03"),
              summary:
                "Firearms were discharged at this address during an altercation. No fatalities reported.",
              sourceUrl: "https://example.com/news/incident-555b",
              severity: 4,
            },
          ],
        },
      },
    }),
    prisma.property.create({
      data: {
        address: "888 Granville Street",
        city: "Vancouver",
        province: "BC",
        postalCode: "V6Z 1K3",
        latitude: 49.2780,
        longitude: -123.1237,
        listingPrice: 1850000,
        historyScore: "POSSIBLE",
        incidents: {
          create: [
            {
              latitude: 49.2780,
              longitude: -123.1237,
              type: "Suspicious death",
              date: new Date("2017-02-28"),
              summary:
                "A death at this address was initially investigated as suspicious. Coroner later ruled it accidental.",
              severity: 2,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Seeded ${properties.length} properties`);
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
