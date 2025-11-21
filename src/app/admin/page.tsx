"use client";

import { useState } from "react";

interface ExtractedIncident {
  address: string | null;
  city: string | null;
  date: string | null;
  type: string;
  summary: string;
  sourceUrl: string;
  confidence: "high" | "medium" | "low";
}

export default function AdminPage() {
  const [incidents, setIncidents] = useState<ExtractedIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [bulkContent, setBulkContent] = useState("");

  const extractFromUrl = async () => {
    if (!articleUrl.trim()) {
      setStatus("Please enter a news article URL");
      return;
    }
    if (!apiKey.trim()) {
      setStatus("Please enter your OpenAI API key");
      return;
    }

    setLoading(true);
    setStatus("Fetching article and extracting incident data...");

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: articleUrl,
          aiApiKey: apiKey,
        }),
      });
      const data = await response.json();

      if (data.error) {
        setStatus(`Error: ${data.error}`);
      } else if (data.incident) {
        setIncidents((prev) => [...prev, data.incident]);
        setStatus("Incident extracted! Review and approve below.");
        setArticleUrl("");
      } else {
        setStatus("No BC address found in this article. Try a different one.");
      }
    } catch (error) {
      console.error("Extraction failed:", error);
      setStatus("Extraction failed - check browser console");
    }
    setLoading(false);
  };

  const approveIncident = async (incident: ExtractedIncident, index: number) => {
    if (!incident.address || !incident.city) {
      alert("Cannot approve: missing address or city");
      return;
    }

    setSaving(incident.sourceUrl);
    setStatus("Geocoding address...");

    try {
      // Geocode the address
      const geocodeResponse = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: incident.address,
          city: incident.city,
        }),
      });

      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.success) {
        const manualEntry = confirm(
          `Could not geocode "${incident.address}, ${incident.city}". Would you like to enter coordinates manually?`
        );
        if (manualEntry) {
          const lat = prompt("Enter latitude:", "49.2827");
          const lng = prompt("Enter longitude:", "-123.1207");
          if (!lat || !lng) {
            setSaving(null);
            return;
          }
          geocodeData.latitude = parseFloat(lat);
          geocodeData.longitude = parseFloat(lng);
        } else {
          setSaving(null);
          setStatus("Geocoding failed - incident not saved");
          return;
        }
      }

      setStatus("Saving incident...");

      // Save the incident
      const response = await fetch("/api/scraper", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...incident,
          latitude: geocodeData.latitude,
          longitude: geocodeData.longitude,
          severity:
            incident.confidence === "high"
              ? 5
              : incident.confidence === "medium"
                ? 4
                : 3,
        }),
      });

      if (response.ok) {
        setIncidents((prev) => prev.filter((_, i) => i !== index));
        setStatus("Incident saved successfully!");
      } else {
        setStatus("Failed to save incident");
      }
    } catch (error) {
      console.error("Save failed:", error);
      setStatus("Save failed - check console");
    }
    setSaving(null);
  };

  const dismissIncident = (index: number) => {
    setIncidents((prev) => prev.filter((_, i) => i !== index));
  };

  const parseBulkContent = () => {
    if (!bulkContent.trim()) {
      setStatus("Please paste content from HouseCreep");
      return;
    }

    setLoading(true);
    setStatus("Parsing listings...");

    try {
      const listings: ExtractedIncident[] = [];

      // Split by listings - each starts with an address pattern
      const addressPattern = /(\d+[^\/\n]*?)\s*\/\s*([^\/\n]+?)\s*\/\s*British Columbia/g;
      const matches = [...bulkContent.matchAll(addressPattern)];

      for (const match of matches) {
        const address = match[1].trim();
        const city = match[2].trim();

        // Find the description after this address
        const startIndex = match.index || 0;
        const nextMatch = matches[matches.indexOf(match) + 1];
        const endIndex = nextMatch?.index || bulkContent.length;
        const section = bulkContent.slice(startIndex, endIndex);

        // Extract description (first paragraph of text)
        const descMatch = section.match(/(?:Canada|\/)\s*\n\s*([^\n]+(?:\n(?!\d+\s+report)[^\n]+)*)/);
        const description = descMatch ? descMatch[1].trim().slice(0, 200) : "";

        // Try to extract date from description
        let date = null;
        const datePatterns = [
          /(\w+ \d+,? \d{4})/,  // "September 30, 1988"
          /(\d{4})/              // Just year
        ];
        for (const pattern of datePatterns) {
          const dateMatch = description.match(pattern);
          if (dateMatch) {
            date = dateMatch[1];
            break;
          }
        }

        // Determine type from keywords
        let type = "Homicide";
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes("unsolved")) type = "Unsolved Homicide";
        else if (lowerDesc.includes("shooting") || lowerDesc.includes("shot")) type = "Shooting";
        else if (lowerDesc.includes("stabbing") || lowerDesc.includes("stabbed")) type = "Stabbing";
        else if (lowerDesc.includes("suspicious death")) type = "Suspicious death";

        listings.push({
          address,
          city,
          date,
          type,
          summary: description,
          sourceUrl: "https://www.housecreep.com",
          confidence: "high",
        });
      }

      if (listings.length > 0) {
        setIncidents((prev) => [...prev, ...listings]);
        setStatus(`Parsed ${listings.length} listings! Review and approve below.`);
        setBulkContent("");
      } else {
        setStatus("No listings found. Make sure you copied the content correctly.");
      }
    } catch (error) {
      console.error("Parse error:", error);
      setStatus("Failed to parse content - check console");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">Admin: Add Incidents</h1>
      <p className="mt-2 text-muted">
        Paste a news article URL to extract incident data using AI
      </p>

      {/* Extract from URL */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
          />
          <p className="mt-1 text-xs text-muted">
            Get key at{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              className="text-accent hover:underline"
            >
              platform.openai.com/api-keys
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            News Article URL
          </label>
          <input
            type="url"
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            placeholder="https://www.cbc.ca/news/canada/british-columbia/..."
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
          />
          <p className="mt-1 text-xs text-muted">
            Paste a news article about a crime in BC
          </p>
        </div>

        <button
          onClick={extractFromUrl}
          disabled={loading}
          className="rounded bg-accent px-4 py-2 font-medium text-white hover:bg-accent-light disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract Incident"}
        </button>

        {status && (
          <p
            className={`text-sm ${status.includes("Error") || status.includes("failed") ? "text-red-400" : "text-green-400"}`}
          >
            {status}
          </p>
        )}
      </div>

      {/* Bulk Import from HouseCreep */}
      <div className="mt-6 rounded-lg border border-accent/30 bg-surface p-4">
        <h2 className="font-semibold text-foreground">
          Bulk Import from HouseCreep
        </h2>
        <p className="mt-1 text-sm text-muted">
          Browse HouseCreep, select all the listings text, copy it, and paste below
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.housecreep.com/directory/ca/british%20columbia/vancouver?bounds=-123.2249611&bounds=49.1989306&bounds=-123.0232419&bounds=49.3161714&near=-123.11934%2C49.24966&sort=new"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-accent px-3 py-2 text-sm text-white hover:bg-accent-light"
            >
              Vancouver (38 properties)
            </a>
            <a
              href="https://www.housecreep.com/directory/ca/british%20columbia/surrey"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-surface-light px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Surrey
            </a>
            <a
              href="https://www.housecreep.com/directory/ca/british%20columbia/burnaby"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-surface-light px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Burnaby
            </a>
            <a
              href="https://www.housecreep.com/directory/ca/british%20columbia/victoria"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-surface-light px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Victoria
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Paste HouseCreep listings content
            </label>
            <textarea
              value={bulkContent}
              onChange={(e) => setBulkContent(e.target.value)}
              rows={6}
              placeholder="Open HouseCreep, scroll down to see all listings, select all text (Ctrl+A), copy, and paste here..."
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground font-mono text-sm"
            />
          </div>

          <button
            onClick={parseBulkContent}
            disabled={loading}
            className="rounded bg-accent px-4 py-2 font-medium text-white hover:bg-accent-light disabled:opacity-50"
          >
            {loading ? "Parsing..." : "Parse Listings"}
          </button>
        </div>
      </div>

      {/* Suggested Sources */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="font-semibold text-foreground">Find News Articles</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href="https://www.cbc.ca/news/canada/british-columbia"
            target="_blank"
            className="rounded bg-surface-light px-3 py-1 text-sm text-muted hover:text-foreground"
          >
            CBC Vancouver
          </a>
          <a
            href="https://globalnews.ca/bc/"
            target="_blank"
            className="rounded bg-surface-light px-3 py-1 text-sm text-muted hover:text-foreground"
          >
            Global News BC
          </a>
          <a
            href="https://vancouversun.com/category/news/crime"
            target="_blank"
            className="rounded bg-surface-light px-3 py-1 text-sm text-muted hover:text-foreground"
          >
            Vancouver Sun Crime
          </a>
          <a
            href="https://vpd.ca/news/"
            target="_blank"
            className="rounded bg-surface-light px-3 py-1 text-sm text-muted hover:text-foreground"
          >
            VPD News
          </a>
        </div>
      </div>

      {/* Extracted Incidents */}
      {incidents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">
            Extracted Incidents ({incidents.length})
          </h2>
          <div className="mt-4 space-y-4">
            {incidents.map((incident, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          incident.confidence === "high"
                            ? "bg-green-500/20 text-green-400"
                            : incident.confidence === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {incident.confidence} confidence
                      </span>
                      <span className="text-sm text-accent">{incident.type}</span>
                    </div>
                    <p className="mt-2 font-medium text-foreground">
                      {incident.address || "Address unknown"},{" "}
                      {incident.city || "City unknown"}
                    </p>
                    <p className="mt-1 text-sm text-muted">{incident.summary}</p>
                    <p className="mt-1 text-xs text-muted">
                      Date: {incident.date || "Unknown"} |{" "}
                      <a
                        href={incident.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Source
                      </a>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveIncident(incident, index)}
                      disabled={saving === incident.sourceUrl}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving === incident.sourceUrl ? "Saving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => dismissIncident(index)}
                      className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Entry Link */}
      <div className="mt-8 rounded-lg border border-border bg-surface p-4">
        <h2 className="font-semibold text-foreground">Manual Entry</h2>
        <p className="mt-1 text-sm text-muted">
          Know all the details already? Add directly without AI extraction.
        </p>
        <a
          href="/admin/add"
          className="mt-4 inline-block rounded bg-accent px-4 py-2 text-white hover:bg-accent-light"
        >
          Add Incident Manually
        </a>
      </div>
    </div>
  );
}
