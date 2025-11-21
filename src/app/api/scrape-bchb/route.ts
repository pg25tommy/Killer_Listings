import { NextRequest, NextResponse } from "next/server";

interface BCHBListing {
  address: string;
  city: string;
  description: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    // Fetch the BCHB listings page
    const response = await fetch(
      "https://bchb.ca/bc-real-estate/bc-listings/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch BCHB page" },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract listing data from the HTML
    // This is a basic extraction - may need adjustment based on actual HTML structure
    const listings: BCHBListing[] = [];

    // Look for listing patterns in the HTML
    // The site likely has structured listing data

    // Pattern 1: Look for address-like patterns with BC cities
    const bcCities = [
      "Vancouver",
      "Burnaby",
      "Surrey",
      "Richmond",
      "Coquitlam",
      "Delta",
      "North Vancouver",
      "West Vancouver",
      "New Westminster",
      "Victoria",
      "Langley",
      "Abbotsford",
      "Kelowna",
      "Nanaimo",
      "Kamloops",
      "Chilliwack",
    ];

    // Extract text content
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\s+/g, " ");

    // Find addresses with BC cities
    const addressPattern = /(\d+[^,\n]{5,50}),?\s*((?:Vancouver|Burnaby|Surrey|Richmond|Victoria|New Westminster|Coquitlam|North Vancouver|West Vancouver|Delta|Langley|Abbotsford|Kelowna|Nanaimo|Kamloops|Chilliwack))/gi;

    let match;
    const seen = new Set<string>();

    while ((match = addressPattern.exec(textContent)) !== null) {
      const address = match[1].trim();
      const city = match[2].trim();
      const key = `${address}-${city}`;

      if (!seen.has(key) && address.length > 5 && address.length < 100) {
        seen.add(key);
        listings.push({
          address,
          city,
          description: "",
          url: "https://bchb.ca/bc-real-estate/bc-listings/",
        });
      }
    }

    // Also try to extract from any JSON-LD or structured data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const jsonStr of jsonLdMatch) {
        try {
          const cleaned = jsonStr
            .replace(/<script[^>]*>/gi, "")
            .replace(/<\/script>/gi, "");
          const data = JSON.parse(cleaned);
          // Process structured data if available
          console.log("Found structured data:", data);
        } catch {
          // Ignore JSON parse errors
        }
      }
    }

    // Return a snippet of the HTML for debugging if no listings found
    if (listings.length === 0) {
      // Return raw content preview for manual inspection
      return NextResponse.json({
        success: true,
        listings: [],
        debug: {
          contentLength: html.length,
          preview: textContent.slice(0, 2000),
          message: "No structured listings found. Site may require different parsing approach.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("BCHB scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape BCHB" },
      { status: 500 }
    );
  }
}
