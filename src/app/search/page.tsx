import { Suspense } from "react";
import { SearchBar, PropertyCard } from "@/components/ui";
import prisma from "@/lib/prisma";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; city?: string }>;
}

async function SearchResults({ query, city }: { query?: string; city?: string }) {
  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Enter an address to search</p>
      </div>
    );
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: [
        {
          OR: [
            { address: { contains: query } },
            { postalCode: { contains: query } },
            { city: { contains: query } },
          ],
        },
        city ? { city: { equals: city } } : {},
      ],
    },
    include: {
      _count: {
        select: { incidents: true },
      },
    },
    take: 20,
  });

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground">No properties found for &quot;{query}&quot;</p>
        <p className="text-muted mt-2">
          Try searching with a different address or postal code
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          address={property.address}
          city={property.city}
          historyScore={property.historyScore as import("@/types").HistoryScore}
          listingPrice={property.listingPrice}
          incidentCount={property._count.incidents}
        />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q;
  const city = params.city;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Search Properties</h1>
        <p className="mt-2 text-muted">
          Find property history in British Columbia
        </p>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      {query && (
        <p className="mb-4 text-sm text-muted">
          Showing results for: <span className="text-foreground">{query}</span>
        </p>
      )}

      <Suspense
        fallback={
          <div className="text-center py-12">
            <p className="text-muted">Searching...</p>
          </div>
        }
      >
        <SearchResults query={query} city={city} />
      </Suspense>
    </div>
  );
}
