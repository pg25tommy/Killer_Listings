import { NextRequest, NextResponse } from "next/server";
import { scrapeAndExtractIncidents } from "@/services/newsScraperService";
import prisma from "@/lib/prisma";

// POST: Run the scraper and return extracted incidents for review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const incidents = await scrapeAndExtractIncidents({
      newsApiKey: process.env.NEWS_API_KEY || body.newsApiKey,
      googleApiKey: process.env.GOOGLE_API_KEY,
      googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
      aiApiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || body.aiApiKey,
      aiProvider: process.env.ANTHROPIC_API_KEY ? "anthropic" : "openai",
      daysBack: body.daysBack || 7,
    });

    return NextResponse.json({
      success: true,
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    console.error("Scraper error:", error);
    return NextResponse.json(
      { error: "Failed to run scraper" },
      { status: 500 }
    );
  }
}

// PUT: Approve and save an incident to the database
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, city, date, type, summary, sourceUrl, severity, latitude, longitude } = body;

    if (!address || !city || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields: address, city, latitude, longitude" },
        { status: 400 }
      );
    }

    // Check if property exists, create if not
    let property = await prisma.property.findFirst({
      where: {
        address: { contains: address },
        city: { equals: city },
      },
    });

    if (!property) {
      property = await prisma.property.create({
        data: {
          address,
          city,
          province: "BC",
          latitude,
          longitude,
          historyScore: "CONFIRMED",
        },
      });
    } else {
      // Update history score if needed
      await prisma.property.update({
        where: { id: property.id },
        data: { historyScore: "CONFIRMED" },
      });
    }

    // Create the incident
    const incident = await prisma.incident.create({
      data: {
        propertyId: property.id,
        latitude,
        longitude,
        type: type || "Unknown",
        date: date ? new Date(date) : new Date(),
        summary: summary || "Incident reported",
        sourceUrl,
        severity: severity || 4,
      },
    });

    return NextResponse.json({
      success: true,
      property,
      incident,
    });
  } catch (error) {
    console.error("Save incident error:", error);
    return NextResponse.json(
      { error: "Failed to save incident" },
      { status: 500 }
    );
  }
}
