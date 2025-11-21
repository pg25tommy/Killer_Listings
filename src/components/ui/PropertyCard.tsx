"use client";

import Link from "next/link";
import { HistoryScore } from "@/types";
import { HistoryBadge } from "./HistoryBadge";

interface PropertyCardProps {
  id: string;
  address: string;
  city: string;
  historyScore: HistoryScore;
  listingPrice?: number | null;
  incidentCount?: number;
}

export function PropertyCard({
  id,
  address,
  city,
  historyScore,
  listingPrice,
  incidentCount = 0,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/property/${id}`}>
      <div className="group rounded-lg border border-border bg-surface p-4 transition-all hover:border-accent hover:bg-surface-light">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-foreground group-hover:text-accent-light">
              {address}
            </h3>
            <p className="mt-1 text-sm text-muted">{city}, BC</p>
            {listingPrice && (
              <p className="mt-2 text-lg font-semibold text-foreground">
                {formatPrice(listingPrice)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <HistoryBadge score={historyScore} size="sm" />
            {incidentCount > 0 && (
              <span className="text-xs text-muted">
                {incidentCount} incident{incidentCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <span className="text-sm font-medium text-accent group-hover:text-accent-light">
            View History &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}