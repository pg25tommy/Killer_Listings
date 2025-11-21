import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, aiApiKey } = await request.json();

    if (!url || !aiApiKey) {
      return NextResponse.json(
        { error: "URL and API key are required" },
        { status: 400 }
      );
    }

    // Fetch the article content
    let articleContent = "";
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KillerListings/1.0)",
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch article" },
          { status: 400 }
        );
      }

      const html = await response.text();

      // Basic HTML to text extraction
      articleContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 8000); // Limit content
    } catch {
      return NextResponse.json(
        { error: "Could not fetch article. Try a different URL." },
        { status: 400 }
      );
    }

    // Use AI to extract incident data
    const prompt = `Analyze this news article and extract information about any violent crime incident (homicide, shooting, assault, stabbing, etc.) that occurred at a specific address in British Columbia, Canada.

Article URL: ${url}
Article Content: ${articleContent}

If this article describes a violent incident at a BC address, extract the following in JSON format:
{
  "isRelevant": true,
  "address": "street address (e.g., '123 Main Street')",
  "city": "city name (e.g., 'Vancouver')",
  "date": "incident date in YYYY-MM-DD format",
  "type": "incident type (e.g., 'Homicide', 'Shooting', 'Assault', 'Stabbing')",
  "summary": "2-3 sentence summary of what happened",
  "confidence": "high/medium/low (how confident the address is specific and accurate)"
}

If this is NOT about a violent crime at a specific BC address, return:
{
  "isRelevant": false
}

Only return valid JSON, no other text.`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!aiResponse.ok) {
      const error = await aiResponse.text();
      console.error("OpenAI error:", error);
      return NextResponse.json(
        { error: "AI extraction failed. Check your API key." },
        { status: 400 }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsed;
    try {
      // Handle potential markdown code blocks
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 500 }
      );
    }

    if (!parsed.isRelevant) {
      return NextResponse.json({
        success: true,
        incident: null,
        message: "No BC incident found in this article",
      });
    }

    return NextResponse.json({
      success: true,
      incident: {
        address: parsed.address,
        city: parsed.city,
        date: parsed.date,
        type: parsed.type,
        summary: parsed.summary,
        sourceUrl: url,
        confidence: parsed.confidence || "medium",
      },
    });
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json(
      { error: "Extraction failed" },
      { status: 500 }
    );
  }
}
