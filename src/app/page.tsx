import Image from "next/image";

export const runtime = "edge";

const SUBSCRIBE_EMAIL = "michael@schoolofthinking.org";

const mailtoHref = (() => {
  const subject = "SOTlobe.ai — One Year Subscription";
  const body =
    "Hi Michael,\n\n" +
    "I'd like to subscribe to SOTlobe.ai for one year — please send me my subscriber URL.\n\n" +
    "Name:\n" +
    "Company / use case:\n" +
    "AI agent or platform I'll be using this with:\n\n" +
    "Thanks!";
  return `mailto:${SUBSCRIBE_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
})();

const NAVY = "#1F1F39";
const BLUE = "#0E7DFF";
const PEACH = "#FFF0E9";
const FOOTER = "#182022";

export default function Home() {
  return (
    <div
      className="min-h-full flex flex-col bg-white"
      style={{ color: NAVY, fontFamily: "var(--font-roboto), system-ui, sans-serif" }}
    >
      {/* HERO */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${PEACH} 78%, #fff 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-16 pb-20 sm:pt-24 sm:pb-32 text-center">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex items-center justify-center">
            <Image
              src="/sotlobe-logo.png"
              alt="SOTlobe — ink-brush profile head with neural pattern"
              width={260}
              height={260}
              priority
              className="w-40 sm:w-56 h-auto"
            />
          </div>

          {/* Wordmark */}
          <div
            className="text-sm font-semibold tracking-[0.3em] uppercase mb-3"
            style={{ color: `${NAVY}99` }}
          >
            sotlobe<span style={{ color: BLUE }}>.ai</span>
          </div>

          {/* H1 */}
          <h1
            className="font-black leading-[1.05] tracking-tight"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 5em)",
              fontWeight: 900,
              color: NAVY,
            }}
          >
            Upgrade your AI<br className="hidden sm:block" />
            <span style={{ color: BLUE }}> with advanced thinking</span>.
          </h1>

          <p
            className="mt-6 sm:mt-8 mx-auto max-w-2xl text-base sm:text-xl"
            style={{ color: `${NAVY}99`, lineHeight: 1.55 }}
          >
            SOTlobe is a procedural framework drawn from forty years of School of Thinking research —
            delivered as a live-updated skill file your AI agent fetches in one line.
          </p>

          {/* CTA */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3">
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center rounded-full px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-lg transition bg-[#0E7DFF] hover:bg-[#005fcf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7DFF]"
              style={{
                boxShadow: `0 12px 30px -10px ${BLUE}66`,
              }}
            >
              Start your 1-year subscription →
            </a>
            <p className="text-sm" style={{ color: `${NAVY}80` }}>
              Email{" "}
              <a
                href={mailtoHref}
                className="font-semibold hover:underline"
                style={{ color: BLUE }}
              >
                {SUBSCRIBE_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <h2
            className="text-center font-bold mb-3"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.5em)",
              color: NAVY,
            }}
          >
            One URL. One fetch. Smarter AI.
          </h2>
          <p
            className="text-center mx-auto max-w-2xl text-base sm:text-lg mb-14"
            style={{ color: `${NAVY}99` }}
          >
            Drop the SOTlobe skill into any agent. Your AI gains structured cognitive protocols
            in a single HTTP call.
          </p>

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
            <Feature
              title="Advanced thinking paradigm"
              body="Four cognitive protocols — GBB, DVR, CPV, TPF — derived from Dr Michael Hewitt-Gleeson's neuroscience and SOT methodology."
            />
            <Feature
              title="Drop into any AI"
              body="One HTTPS URL returns a markdown skill manifest. Works with ChatGPT, Claude, Copilot, Gemini, Kimi, and every agent framework that fetches text."
            />
            <Feature
              title="Live updates for a full year"
              body="New thinking tools and refinements ship to your subscriber URL automatically. No re-integration. No version bumps. The skill grows with you."
            />
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section
        className="w-full"
        style={{
          background: `linear-gradient(180deg, ${PEACH} 0%, ${PEACH} 80%, ${FOOTER} 80%)`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 sm:py-24 text-center">
          <h2
            className="font-bold mb-4"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.75em)",
              color: NAVY,
            }}
          >
            Ready to think x10?
          </h2>
          <p
            className="mb-10 text-lg mx-auto max-w-xl"
            style={{ color: `${NAVY}99`, lineHeight: 1.55 }}
          >
            Email Michael with a short note about how you&apos;ll use SOTlobe — your subscriber URL
            arrives within 24 hours.
          </p>
          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center rounded-full px-9 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-lg transition bg-[#0E7DFF] hover:bg-[#005fcf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7DFF]"
            style={{
              boxShadow: `0 12px 30px -10px ${BLUE}66`,
            }}
          >
            Email {SUBSCRIBE_EMAIL}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full" style={{ backgroundColor: FOOTER, color: "#fff" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/sotlobe-logo.png"
              alt=""
              width={40}
              height={40}
              className="w-9 h-9 invert opacity-90"
            />
            <span className="font-bold tracking-tight text-lg">
              sotlobe<span style={{ color: BLUE }}>.ai</span>
            </span>
          </div>
          <p className="text-sm text-white/60 text-center sm:text-right">
            Copyright ©{" "}
            <a
              href="https://schoolofthinking.org"
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white underline-offset-4 hover:underline"
            >
              SchoolofThinking.org
            </a>{" "}
            2026
          </p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="text-center">
      <h3
        className="font-bold text-lg sm:text-xl mb-3"
        style={{ color: NAVY }}
      >
        {title}
      </h3>
      <p style={{ color: `${NAVY}99`, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}
