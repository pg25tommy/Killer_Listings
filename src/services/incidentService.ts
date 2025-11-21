import prisma from "@/lib/prisma";

export async function getIncidentsByPropertyId(propertyId: string) {
  return prisma.incident.findMany({
    where: { propertyId },
    orderBy: { date: "desc" },
  });
}

export async function getIncidentsInBounds(
  north: number,
  south: number,
  east: number,
  west: number
) {
  return prisma.incident.findMany({
    where: {
      latitude: { gte: south, lte: north },
      longitude: { gte: west, lte: east },
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      severity: true,
      type: true,
      date: true,
    },
  });
}

export async function getRecentIncidents(limit = 10) {
  return prisma.incident.findMany({
    orderBy: { date: "desc" },
    take: limit,
    include: {
      property: {
        select: {
          address: true,
          city: true,
        },
      },
    },
  });
}