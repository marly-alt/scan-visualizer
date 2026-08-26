export default function AboutPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-sm text-text/70 leading-relaxed mb-4">
        ScanVisualizer takes the output of a local network scan and turns it into
        a readable report — open ports, running services, and a risk level per
        host. It never scans anything itself; you run the scan, you control what
        gets scanned.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Generating a compatible scan</h2>
      <p className="text-sm text-text/70 leading-relaxed mb-3">
        Using nmap, export your results as JSON or XML:
      </p>
      <pre className="bg-text text-bg text-xs p-4 rounded-md overflow-x-auto">
        nmap -oX scan-results.xml 192.168.1.0/24
      </pre>
      <p className="text-sm text-text/70 leading-relaxed mt-3">
        Then upload the file on the Upload page.
      </p>
    </div>
  );
}
