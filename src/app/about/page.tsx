export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">About Killer Listings</h1>

      <div className="mt-8 space-y-6 text-muted">
        <p>
          Killer Listings is a property intelligence platform that helps home
          buyers, real estate agents, and investors understand the full history
          behind residential properties in British Columbia.
        </p>

        <p>
          We believe that everyone deserves to know the complete story of a
          property before making one of the biggest decisions of their lives.
          Our platform surfaces historical incidents tied to addresses, giving
          you the information you need to make informed decisions.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          Our Mission
        </h2>
        <p>
          To bring transparency to real estate by providing accessible,
          accurate property history information. Your dream home shouldn&apos;t
          come with a nightmare backstory.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">
          Currently Serving
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Vancouver</li>
          <li>Burnaby</li>
          <li>New Westminster</li>
          <li>Richmond</li>
          <li>Surrey</li>
          <li>Delta</li>
          <li>Coquitlam / Tri-Cities</li>
          <li>North Vancouver</li>
          <li>West Vancouver</li>
        </ul>

        <p className="text-sm mt-8">
          More regions coming soon. We&apos;re expanding across British Columbia
          and eventually Canada-wide.
        </p>
      </div>
    </div>
  );
}
