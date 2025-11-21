import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { address, city } = await request.json();

    if (!address || !city) {
      return NextResponse.json(
        { error: "Address and city are required" },
        { status: 400 }
      );
    }

    const fullAddress = `${address}, ${city}, British Columbia, Canada`;

    // Try Mapbox Geocoding first (if token available)
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (mapboxToken) {
      const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxToken}&country=CA&limit=1`;

      const response = await fetch(mapboxUrl);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return NextResponse.json({
          success: true,
          latitude,
          longitude,
          provider: "mapbox",
        });
      }
    }

    // Fallback to Nominatim (OpenStreetMap) - free but rate limited
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;

    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "KillerListings/1.0",
      },
    });

    const data = await response.json();

    if (data && data.length > 0) {
      return NextResponse.json({
        success: true,
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        provider: "nominatim",
      });
    }

    return NextResponse.json(
      { error: "Address not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 500 }
    );
  }
}
