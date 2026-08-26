export default async function ReportDetailPage({ params }) {
  const { id } = await params;

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-accent mb-2">Report</p>
      <h1 className="text-2xl font-bold mb-6">Scan #{id}</h1>

      <div className="border border-dashed border-border rounded-lg p-10 text-center">
        <p className="text-text/70 text-sm">
          Port, service, and risk-level breakdown for this report will render here
          once report parsing is implemented.
        </p>
      </div>
    </div>
  );
}
