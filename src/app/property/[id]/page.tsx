import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { HistoryBadge, IncidentCard } from "@/components/ui";
import { HISTORY_SCORE_LABELS } from "@/lib/constants";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      incidents: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero Section */}
      <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {property.address}
            </h1>
            <p className="mt-2 text-muted">
              {property.city}, {property.province}{" "}
              {property.postalCode && `• ${property.postalCode}`}
            </p>
            {property.listingPrice && (
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {new Intl.NumberFormat("en-CA", {
                  style: "currency",
                  currency: "CAD",
                  maximumFractionDigits: 0,
                }).format(property.listingPrice)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <HistoryBadge score={property.historyScore as HistoryScore} size="lg" />
            <p className="text-sm text-muted max-w-xs md:text-right">
              {HISTORY_SCORE_LABELS[property.historyScore as HistoryScore]}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="mt-6 flex gap-4 text-sm text-muted">
          <span>Lat: {property.latitude.toFixed(6)}</span>
          <span>Lng: {property.longitude.toFixed(6)}</span>
        </div>
      </div>

      {/* Incident Timeline */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground">Incident Timeline</h2>
        {property.incidents.length === 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-surface p-6 text-center">
            <p className="text-muted">
              No incidents recorded for this property.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {property.incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                type={incident.type}
                date={incident.date}
                summary={incident.summary}
                sourceUrl={incident.sourceUrl}
                severity={incident.severity}
              />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg border border-border bg-surface-light p-6">
        <h3 className="font-semibold text-foreground">Disclaimer</h3>
        <p className="mt-2 text-sm text-muted">
          The information provided on Killer Listings is for informational
          purposes only. While we strive to provide accurate and up-to-date
          information, we make no representations or warranties of any kind
          about the completeness, accuracy, or reliability of this data. Always
          conduct your own due diligence before making any real estate
          decisions.
        </p>
      </div>
    </div>
  );
}
