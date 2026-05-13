export const runtime = "edge";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col py-32 px-8 sm:px-16">
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
            sotlobe<span className="text-zinc-400 dark:text-zinc-500">.ai</span>
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Universal Scales delivery engine — a thinking lobe for your AI.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-200">
            For agents
          </h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            Fetch your manifest with the subscriber key you were issued:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md bg-zinc-900 px-4 py-3 text-sm text-zinc-100 dark:bg-zinc-900/50">
            <code>GET https://sotlobe.ai/{`{access_code}`}</code>
          </pre>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Returns <code className="font-mono">text/markdown</code>. Cached at the edge for 1h.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-200">
            For humans
          </h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            Contact{" "}
            <a
              href="https://schoolofthinking.org"
              className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              School of Thinking
            </a>{" "}
            for access.
          </p>
        </section>
      </main>
    </div>
  );
}
