export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>

      <div className="mt-8 space-y-6 text-muted">
        <p>
          Have questions, feedback, or information to share? We&apos;d love to
          hear from you.
        </p>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Get in Touch
          </h2>
          <p className="mt-4">
            For general inquiries, data corrections, or partnership
            opportunities, please reach out to us.
          </p>
          <p className="mt-4 text-foreground">
            Email:{" "}
            <a
              href="mailto:info@killerlistings.ca"
              className="text-accent hover:text-accent-light"
            >
              info@killerlistings.ca
            </a>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Report an Incident
          </h2>
          <p className="mt-4">
            Know of an incident at a property that we haven&apos;t listed? We
            only accept information from verified public sources such as news
            reports, police releases, or court records.
          </p>
          <p className="mt-4 text-sm text-muted/70">
            Please include the address, date, and a link to a public source when
            submitting information.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Data Corrections
          </h2>
          <p className="mt-4">
            If you believe any information on our platform is inaccurate or
            incomplete, please contact us with details and supporting
            documentation. We take accuracy seriously and will review all
            submissions.
          </p>
        </div>
      </div>
    </div>
  );
}
