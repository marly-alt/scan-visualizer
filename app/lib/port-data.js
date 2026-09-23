// Small reference dataset of commonly-scanned ports, used by the
// lookupPort tool. Not exhaustive — just enough real, common services to
// make the tool genuinely useful for a home/small-network scan report.

export const PORT_DATA = {
  21: { service: "FTP", riskLevel: "high", description: "File Transfer Protocol. Transmits credentials and files in plain text.", recommendation: "Disable and use SFTP (port 22) instead." },
  22: { service: "SSH", riskLevel: "medium", description: "Secure Shell — encrypted remote administration.", recommendation: "Keep enabled but restrict to trusted networks and use key-based auth." },
  23: { service: "Telnet", riskLevel: "critical", description: "Unencrypted remote access. Credentials and commands are fully exposed.", recommendation: "Disable entirely — there is no secure way to use Telnet today." },
  25: { service: "SMTP", riskLevel: "medium", description: "Mail transfer between servers.", recommendation: "Only expose if you're actually running a mail server; require authentication." },
  53: { service: "DNS", riskLevel: "low", description: "Domain name resolution.", recommendation: "Normal on routers/DNS servers; ensure it isn't an open resolver reachable from the internet." },
  80: { service: "HTTP", riskLevel: "medium", description: "Unencrypted web traffic.", recommendation: "Redirect to HTTPS (443) wherever possible." },
  110: { service: "POP3", riskLevel: "medium", description: "Legacy email retrieval, often unencrypted.", recommendation: "Use POP3S (995) or IMAPS (993) instead." },
  139: { service: "NetBIOS", riskLevel: "high", description: "Legacy Windows file/printer sharing.", recommendation: "Block from the internet; a common attack target." },
  143: { service: "IMAP", riskLevel: "medium", description: "Email retrieval, often unencrypted.", recommendation: "Use IMAPS (993) instead." },
  443: { service: "HTTPS", riskLevel: "low", description: "Encrypted web traffic.", recommendation: "Standard and expected to be open on web servers." },
  445: { service: "SMB", riskLevel: "critical", description: "Windows file sharing. Frequently exploited (e.g. WannaCry).", recommendation: "Never expose to the internet; restrict to local network only." },
  3306: { service: "MySQL", riskLevel: "high", description: "Database server.", recommendation: "Never expose directly to the internet; use a VPN or SSH tunnel." },
  3389: { service: "RDP", riskLevel: "critical", description: "Windows Remote Desktop.", recommendation: "Never expose directly to the internet; a top target for ransomware attacks." },
  5900: { service: "VNC", riskLevel: "high", description: "Remote desktop access, often with weak default auth.", recommendation: "Restrict to local network and require strong authentication." },
  8080: { service: "HTTP (alt)", riskLevel: "medium", description: "Common alternate web/proxy port.", recommendation: "Treat the same as port 80 — prefer HTTPS." },
};