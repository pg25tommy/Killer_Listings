"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddIncidentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "Vancouver",
    date: new Date().toISOString().split("T")[0],
    type: "Homicide",
    summary: "",
    sourceUrl: "",
    severity: 4,
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/scraper", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });

      if (response.ok) {
        alert("Incident added successfully!");
        router.push("/admin");
      } else {
        alert("Failed to add incident");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to add incident");
    }

    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">Add Incident Manually</h1>
      <p className="mt-2 text-muted">
        Enter incident details from a verified news source
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Street Address *
          </label>
          <input
            type="text"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="123 Main Street"
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            City *
          </label>
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
          >
            <option>Vancouver</option>
            <option>Burnaby</option>
            <option>Surrey</option>
            <option>Richmond</option>
            <option>Coquitlam</option>
            <option>Delta</option>
            <option>North Vancouver</option>
            <option>West Vancouver</option>
            <option>New Westminster</option>
            <option>Victoria</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Latitude *
            </label>
            <input
              type="text"
              required
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              placeholder="49.2827"
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Longitude *
            </label>
            <input
              type="text"
              required
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              placeholder="-123.1207"
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <p className="text-xs text-muted">
          Tip: Get coordinates from{" "}
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Google Maps
          </a>{" "}
          - right-click on location and copy coordinates
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Incident Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            >
              <option>Homicide</option>
              <option>Shooting</option>
              <option>Stabbing</option>
              <option>Assault</option>
              <option>Drug-related</option>
              <option>Suspicious death</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Severity (1-5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: parseInt(e.target.value) })}
            className="mt-1 w-full"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>Minor</span>
            <span>Current: {form.severity}</span>
            <span>Severe</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Summary *
          </label>
          <textarea
            required
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={3}
            placeholder="Describe what happened..."
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Source URL
          </label>
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            placeholder="https://news.example.com/article"
            className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-accent px-6 py-2 font-medium text-white hover:bg-accent-light disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add Incident"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-border px-6 py-2 text-foreground hover:bg-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
