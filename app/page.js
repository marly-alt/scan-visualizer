export default function Home() {
  return (
    <div>
      <div className="border-b border-border pb-8 mb-8">
        <p className="text-xs uppercase tracking-widest text-accent mb-2">
          Network Security
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 max-w-xl">
          Upload a scan. See what&apos;s actually exposed.
        </h1>
        <p className="text-text/70 max-w-lg text-sm leading-relaxed">
          Run an nmap scan locally, export the results, and upload them here to see
          open ports, running services, and a risk breakdown per host — without
          scanning anything live from the browser.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatPlaceholder label="Reports scanned" />
        <StatPlaceholder label="Hosts tracked" />
        <StatPlaceholder label="Open high-risk ports" />
      </div>
    </div>
  );
}

function StatPlaceholder({ label }) {
  return (
    <div className="border border-border rounded-lg p-5 bg-white/40">
      <p className="text-2xl font-display font-bold text-main">—</p>
      <p className="text-xs text-text/60 mt-1">{label}</p>
    </div>
  );
}
