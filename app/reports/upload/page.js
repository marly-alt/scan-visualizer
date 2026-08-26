"use client";

import { useState } from "react";

export default function UploadPage() {
  const [fileName, setFileName] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-2">Upload a scan</h1>
      <p className="text-text/70 text-sm mb-6">
        Export your nmap scan as JSON or XML, then upload it here. Parsing and
        risk scoring will be wired up in a later phase.
      </p>

      <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-main transition-colors">
        <input
          type="file"
          accept=".json,.xml"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-sm text-text/70">
          {fileName ? `Selected: ${fileName}` : "Click to choose a file (.json or .xml)"}
        </p>
      </label>

      <button
        type="button"
        disabled={!fileName}
        className="mt-4 w-full bg-main text-bg py-2.5 rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Upload &amp; parse (coming soon)
      </button>
    </div>
  );
}
