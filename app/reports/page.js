import Link from "next/link";

// Placeholder data — will be replaced with real uploaded reports.
const PLACEHOLDER_REPORTS = [];

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Link
          href="/reports/upload"
          className="text-sm bg-main text-bg px-4 py-2 rounded-md font-medium"
        >
          Upload a scan
        </Link>
      </div>

      {PLACEHOLDER_REPORTS.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-text/70 text-sm mb-4">
            No reports yet. Upload your first nmap scan to see it here.
          </p>
          <Link href="/reports/upload" className="text-main text-sm underline">
            Upload a scan
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {PLACEHOLDER_REPORTS.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
