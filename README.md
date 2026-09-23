This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




## AI tool: lookupPort

The chat assistant (`/chat`) can call one server-side tool, `lookupPort`, defined in `app/lib/tools.js`.

**Name:** `lookupPort`

**Input schema** (Zod):

{
port: number // a port number, expected 1-65535
}


**Return shape (success):**

{
port: number,
known: boolean, // whether we have curated data for this port
service: string | null,
riskLevel: "low" | "medium" | "high" | "critical" | "unknown",
description: string,
recommendation: string
}


**Failure case:** if `port` is outside the valid 1-65535 range, the tool throws an error instead of returning a result. This is a genuine input-validation failure — distinct from an unrecognized-but-valid port number, which is handled as a normal successful result with `known: false` and generic guidance.

**Reference data:** a small curated set of 15 common ports lives in `app/lib/port-data.js` (FTP, SSH, Telnet, HTTP/HTTPS, SMB, RDP, etc.), each with a risk level, description, and recommendation.

**UI rendering:** the tool's four lifecycle states are rendered distinctly in `app/components/ChatWindow.js`:
- `input-streaming` — a pulsing skeleton, "Preparing port lookup…"
- `input-available` — a spinner, "Looking up port {n}"
- `output-available` — a real component (`PortResultCard`): a risk-colored card with the port, service, risk badge, description, and recommendation
- `output-error` — a distinct red-bordered card with a warning icon and the actual error message, not a crash or blank state