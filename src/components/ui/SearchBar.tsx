"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  size?: "default" | "large";
  placeholder?: string;
}

export function SearchBar({
  size = "default",
  placeholder = "Search address, postal code, or city...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeClasses =
    size === "large"
      ? "px-6 py-4 text-lg rounded-xl"
      : "px-4 py-2 text-base rounded-lg";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-border bg-surface text-foreground placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${sizeClasses}`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-accent-light ${size === "large" ? "px-6 py-3" : ""}`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
