import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BC_BOUNDS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const north = parseFloat(searchParams.get("north") || String(BC_BOUNDS.north));
  const south = parseFloat(searchParams.get("south") || String(BC_BOUNDS.south));
  const east = parseFloat(searchParams.get("east") || String(BC_BOUNDS.east));
  const west = parseFloat(searchParams.get("west") || String(BC_BOUNDS.west));

  try {
    const [properties, incidents] = await Promise.all([
      prisma.property.findMany({
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
      }),
      prisma.incident.findMany({
        where: {
          latitude: { gte: south, lte: north },
          longitude: { gte: west, lte: east },
          propertyId: null,
        },
        select: {
          id: true,
          latitude: true,
          longitude: true,
          severity: true,
          type: true,
        },
      }),
    ]);

    return NextResponse.json({ properties, incidents });
  } catch (error) {
    console.error("Map data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch map data" },
      { status: 500 }
    );
  }
}
