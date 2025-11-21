import prisma from "@/lib/prisma";
import MapView from "@/components/ui/MapView";

export default async function MapPage() {
  // Fetch all properties with coordinates
  const allProperties = await prisma.property.findMany({
    include: {
      incidents: {
        select: { id: true, type: true },
      },
    },
  });

  // Filter properties that have coordinates
  const properties = allProperties.filter(
    (p) => p.latitude !== null && p.latitude !== 0 && p.longitude !== null && p.longitude !== 0
  );

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-border bg-surface px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">
          BC Property Map
        </h1>
        <p className="text-sm text-muted">
          {properties.length} properties with incident history
        </p>
        <div className="mt-2 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-white"></div>
            <span className="text-muted">Clean</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white"></div>
            <span className="text-muted">Possible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white"></div>
            <span className="text-muted">Confirmed</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        {!mapboxToken ? (
          <div className="h-full rounded-lg border border-border bg-surface flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-muted">
                Map requires Mapbox token. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env
              </p>
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-accent hover:underline"
              >
                Get Mapbox Token →
              </a>
            </div>
          </div>
        ) : (
          <MapView properties={properties} mapboxToken={mapboxToken} />
        )}
      </div>
    </div>
  );
}
