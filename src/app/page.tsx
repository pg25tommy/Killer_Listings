import { SearchBar } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your dream home shouldn&apos;t come with a{" "}
            <span className="text-accent">nightmare backstory</span>
          </h1>
          <p className="mt-6 text-lg text-muted">
            Discover the full history behind any property in British Columbia.
            Search addresses, view incident timelines, and make informed
            decisions.
          </p>

          <div className="mt-10 w-full max-w-2xl mx-auto">
            <SearchBar size="large" />
          </div>

          <p className="mt-4 text-sm text-muted">
            Currently available in Vancouver and the Lower Mainland
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-surface py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-foreground">
            How It Works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent">
                1
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                Search Any Address
              </h3>
              <p className="mt-2 text-sm text-muted">
                Enter a BC address, postal code, or city to start your search.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent">
                2
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                View History Score
              </h3>
              <p className="mt-2 text-sm text-muted">
                See at a glance if the property has any known incidents in its
                history.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent">
                3
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                Make Informed Decisions
              </h3>
              <p className="mt-2 text-sm text-muted">
                Review detailed incident timelines with linked sources before
                you commit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Killer Listings. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a href="/about" className="text-sm text-muted hover:text-accent">
              About
            </a>
            <a href="/legal" className="text-sm text-muted hover:text-accent">
              Legal
            </a>
            <a href="/contact" className="text-sm text-muted hover:text-accent">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}