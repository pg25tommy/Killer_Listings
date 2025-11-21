export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Legal Disclaimer</h1>

      <div className="mt-8 space-y-6 text-muted">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Information Accuracy
          </h2>
          <p className="mt-2">
            The information provided on Killer Listings is compiled from
            publicly available sources and is provided for informational
            purposes only. While we strive to maintain accuracy, we make no
            representations or warranties of any kind, express or implied, about
            the completeness, accuracy, reliability, suitability, or
            availability of the information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Not Legal or Real Estate Advice
          </h2>
          <p className="mt-2">
            The content on this platform does not constitute legal, real estate,
            or professional advice. You should always conduct your own due
            diligence and consult with qualified professionals before making any
            real estate decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Limitation of Liability
          </h2>
          <p className="mt-2">
            In no event shall Killer Listings be liable for any direct,
            indirect, incidental, special, consequential, or punitive damages
            arising out of or relating to your use of, or inability to use, this
            platform or any information provided herein.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Third-Party Sources
          </h2>
          <p className="mt-2">
            Our data is sourced from publicly available records, news reports,
            and other third-party sources. We are not responsible for the
            accuracy or completeness of information from these sources. Links to
            external sources are provided for reference and do not imply
            endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Privacy
          </h2>
          <p className="mt-2">
            We respect your privacy. We do not sell personal information. Any
            data collected through our platform is used solely for providing our
            services and improving user experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Updates to This Disclaimer
          </h2>
          <p className="mt-2">
            We reserve the right to update this disclaimer at any time. Changes
            will be posted on this page with an updated revision date.
          </p>
        </section>

        <p className="text-sm text-muted/60 mt-8">
          Last updated: {new Date().toLocaleDateString("en-CA")}
        </p>
      </div>
    </div>
  );
}
