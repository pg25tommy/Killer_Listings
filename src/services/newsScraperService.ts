// News Scraper Service
// Fetches crime news and extracts incident data using AI

const BC_CITIES = [
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
];

const CRIME_KEYWORDS = [
  "homicide",
  "murder",
  "shooting",
  "stabbing",
  "death",
  "killed",
  "fatal",
  "assault",
];

interface ScrapedArticle {
  title: string;
  url: string;
  publishedAt: string;
  content: string;
  source: string;
}

interface ExtractedIncident {
  address: string | null;
  city: string | null;
  date: string | null;
  type: string;
  summary: string;
  sourceUrl: string;
  confidence: "high" | "medium" | "low";
}

// NewsAPI.org - requires API key (free tier: 100 requests/day)
export async function fetchNewsArticles(
  apiKey: string,
  daysBack: number = 7
): Promise<ScrapedArticle[]> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysBack);

  const queries = BC_CITIES.flatMap((city) =>
    CRIME_KEYWORDS.slice(0, 3).map((keyword) => `${keyword} ${city} BC`)
  );

  const articles: ScrapedArticle[] = [];

  for (const query of queries.slice(0, 5)) {
    // Limit to avoid rate limits
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?` +
          `q=${encodeURIComponent(query)}&` +
          `from=${fromDate.toISOString().split("T")[0]}&` +
          `sortBy=publishedAt&` +
          `language=en&` +
          `apiKey=${apiKey}`
      );

      if (!response.ok) continue;

      const data = await response.json();

      for (const article of data.articles || []) {
        articles.push({
          title: article.title,
          url: article.url,
          publishedAt: article.publishedAt,
          content: article.content || article.description || "",
          source: article.source?.name || "Unknown",
        });
      }
    } catch (error) {
      console.error(`Failed to fetch news for query: ${query}`, error);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return articles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}

// Alternative: Google Custom Search API
export async function fetchGoogleNews(
  apiKey: string,
  searchEngineId: string,
  query: string
): Promise<ScrapedArticle[]> {
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?` +
      `key=${apiKey}&` +
      `cx=${searchEngineId}&` +
      `q=${encodeURIComponent(query)}&` +
      `dateRestrict=m1&` +
      `num=10`
  );

  if (!response.ok) return [];

  const data = await response.json();

  return (data.items || []).map((item: any) => ({
    title: item.title,
    url: item.link,
    publishedAt: new Date().toISOString(),
    content: item.snippet || "",
    source: "Google Search",
  }));
}

// Extract incident data using OpenAI/Claude API
export async function extractIncidentFromArticle(
  article: ScrapedArticle,
  aiApiKey: string,
  provider: "openai" | "anthropic" = "openai"
): Promise<ExtractedIncident | null> {
  const prompt = `Analyze this news article and extract incident information if it describes a violent crime (homicide, assault, shooting, etc.) at a specific address in British Columbia, Canada.

Article Title: ${article.title}
Article Content: ${article.content}
Source: ${article.source}

Extract the following in JSON format:
{
  "isRelevant": boolean (true if this is about a violent incident at a BC address),
  "address": string or null (street address if mentioned),
  "city": string or null (city name),
  "date": string or null (incident date in YYYY-MM-DD format),
  "type": string (e.g., "Homicide", "Shooting", "Assault", "Stabbing"),
  "summary": string (2-3 sentence summary of what happened),
  "confidence": "high" | "medium" | "low" (how confident the address is accurate)
}

Only return the JSON object, no other text.`;

  try {
    let response;

    if (provider === "openai") {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    } else {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": aiApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
    }

    if (!response.ok) return null;

    const data = await response.json();
    const content =
      provider === "openai"
        ? data.choices?.[0]?.message?.content
        : data.content?.[0]?.text;

    if (!content) return null;

    const parsed = JSON.parse(content);

    if (!parsed.isRelevant) return null;

    return {
      address: parsed.address,
      city: parsed.city,
      date: parsed.date,
      type: parsed.type || "Unknown",
      summary: parsed.summary || article.title,
      sourceUrl: article.url,
      confidence: parsed.confidence || "low",
    };
  } catch (error) {
    console.error("Failed to extract incident:", error);
    return null;
  }
}

// Main scraper function
export async function scrapeAndExtractIncidents(config: {
  newsApiKey?: string;
  googleApiKey?: string;
  googleSearchEngineId?: string;
  aiApiKey: string;
  aiProvider: "openai" | "anthropic";
  daysBack?: number;
}): Promise<ExtractedIncident[]> {
  const articles: ScrapedArticle[] = [];

  // Fetch from NewsAPI
  if (config.newsApiKey) {
    const newsArticles = await fetchNewsArticles(
      config.newsApiKey,
      config.daysBack || 7
    );
    articles.push(...newsArticles);
  }

  // Fetch from Google
  if (config.googleApiKey && config.googleSearchEngineId) {
    for (const city of BC_CITIES.slice(0, 3)) {
      const googleArticles = await fetchGoogleNews(
        config.googleApiKey,
        config.googleSearchEngineId,
        `homicide OR shooting ${city} BC`
      );
      articles.push(...googleArticles);
    }
  }

  console.log(`Found ${articles.length} articles to process`);

  // Extract incidents using AI
  const incidents: ExtractedIncident[] = [];

  for (const article of articles) {
    const incident = await extractIncidentFromArticle(
      article,
      config.aiApiKey,
      config.aiProvider
    );

    if (incident && incident.city) {
      incidents.push(incident);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 500));
  }

  return incidents;
}
