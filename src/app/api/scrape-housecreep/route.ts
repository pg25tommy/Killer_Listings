import { NextRequest, NextResponse } from "next/server";

interface HouseCreepListing {
  address: string;
  city: string;
  type: string;
  description: string;
  date: string | null;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { city = "vancouver" } = await request.json();

    // Fetch the HouseCreep directory page
    const response = await fetch(
      `https://www.housecreep.com/directory/ca/british%20columbia/${encodeURIComponent(city)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch HouseCreep page: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const listings: HouseCreepListing[] = [];

    // Try to find __NEXT_DATA__ which contains the page props
    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/
    );

    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        console.log("Found Next.js data:", JSON.stringify(nextData).slice(0, 500));

        // Navigate the Next.js data structure to find listings
        const pageProps = nextData?.props?.pageProps;
        if (pageProps?.reports) {
          for (const report of pageProps.reports) {
            listings.push({
              address: report.address || report.street || "",
              city: report.city || city,
              type: report.category || report.type || "Unknown",
              description: report.description || report.summary || "",
              date: report.date || report.createdAt || null,
              url: report.slug
                ? `https://www.housecreep.com/report/${report.slug}`
                : "",
            });
          }
        }
      } catch (parseError) {
        console.error("Failed to parse Next.js data:", parseError);
      }
    }

    // If no Next.js data, try parsing HTML directly
    if (listings.length === 0) {
      // Look for property cards/links in the HTML
      // Pattern for addresses like "123 Main Street"
      const addressPattern =
        /href="\/report\/([^"]+)"[^>]*>([^<]*\d+[^<]*(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd|Way|Lane|Ln|Crescent|Cres|Court|Ct|Place|Pl)[^<]*)/gi;

      let match;
      const seen = new Set<string>();

      while ((match = addressPattern.exec(html)) !== null) {
        const slug = match[1];
        const address = match[2].trim();
        const key = slug;

        if (!seen.has(key) && address.length > 5) {
          seen.add(key);
          listings.push({
            address,
            city: city.charAt(0).toUpperCase() + city.slice(1),
            type: "Stigmatized Property",
            description: "",
            date: null,
            url: `https://www.housecreep.com/report/${slug}`,
          });
        }
      }

      // Also try to find property cards by looking for common patterns
      const cardPattern =
        /<a[^>]*href="(\/report\/[^"]+)"[^>]*>[\s\S]*?<\/a>/gi;
      const textPattern = /(\d+\s+[\w\s]+(?:Street|Avenue|Road|Drive|Way))/gi;

      // Extract text content and look for addresses
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "\n");

      let textMatch;
      while ((textMatch = textPattern.exec(textContent)) !== null) {
        const address = textMatch[1].trim();
        if (!seen.has(address) && address.length > 5 && address.length < 100) {
          seen.add(address);
          listings.push({
            address,
            city: city.charAt(0).toUpperCase() + city.slice(1),
            type: "Stigmatized Property",
            description: "",
            date: null,
            url: `https://www.housecreep.com/directory/ca/british%20columbia/${city}`,
          });
        }
      }
    }

    // Return debug info if no listings found
    if (listings.length === 0) {
      // Check if we got blocked or need authentication
      const hasLogin = html.includes("login") || html.includes("sign-in");
      const hasListings = html.includes("report") || html.includes("property");

      return NextResponse.json({
        success: false,
        listings: [],
        debug: {
          contentLength: html.length,
          hasLoginPrompt: hasLogin,
          hasListingContent: hasListings,
          preview: html.slice(0, 3000),
          message:
            "Could not extract listings. The site may require authentication or use client-side rendering.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: listings.length,
      source: "housecreep.com",
      city,
      listings,
    });
  } catch (error) {
    console.error("HouseCreep scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape HouseCreep" },
      { status: 500 }
    );
  }
}
