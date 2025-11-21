"use client";

interface IncidentCardProps {
  type: string;
  date: Date;
  summary: string;
  sourceUrl?: string | null;
  severity: number;
}

const severityStyles: Record<number, string> = {
  1: "border-l-gray-500",
  2: "border-l-yellow-500",
  3: "border-l-orange-500",
  4: "border-l-red-500",
  5: "border-l-red-700",
};

export function IncidentCard({
  type,
  date,
  summary,
  sourceUrl,
  severity,
}: IncidentCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`rounded-lg border border-border bg-surface-light p-4 border-l-4 ${severityStyles[severity] || severityStyles[1]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-block rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-light">
            {type}
          </span>
          <p className="mt-2 text-sm text-muted">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < severity ? "bg-red-500" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-foreground">{summary}</p>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-accent hover:text-accent-light hover:underline"
        >
          View Source &rarr;
        </a>
      )}
    </div>
  );
}