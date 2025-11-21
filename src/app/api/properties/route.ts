import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const city = searchParams.get("city");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const properties = await prisma.property.findMany({
      where: {
        AND: [
          {
            OR: [
              { address: { contains: query } },
              { postalCode: { contains: query } },
              { city: { contains: query } },
            ],
          },
          city ? { city: { equals: city } } : {},
          { province: "BC" },
        ],
      },
      include: {
        _count: {
          select: { incidents: true },
        },
      },
      take: 20,
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search properties" },
      { status: 500 }
    );
  }
}
