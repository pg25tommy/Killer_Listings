import prisma from "@/lib/prisma";
import { HistoryScore } from "@/types";

export async function getPropertyById(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      incidents: {
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function searchProperties(query: string, city?: string) {
  return prisma.property.findMany({
    where: {
      AND: [
        {
          OR: [
            { address: { contains: query } },
            { postalCode: { contains: query } },
          ],
        },
        city ? { city: { equals: city } } : {},
      ],
    },
    include: {
      _count: {
        select: { incidents: true },
      },
    },
    take: 20,
  });
}

export async function getPropertiesInBounds(
  north: number,
  south: number,
  east: number,
  west: number
) {
  return prisma.property.findMany({
    where: {
      latitude: { gte: south, lte: north },
      longitude: { gte: west, lte: east },
    },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      historyScore: true,
      address: true,
      city: true,
    },
  });
}

export async function getPropertiesByHistoryScore(score: HistoryScore) {
  return prisma.property.findMany({
    where: { historyScore: score },
    include: {
      incidents: {
        take: 1,
        orderBy: { severity: "desc" },
      },
    },
  });
}