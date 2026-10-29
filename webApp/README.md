# ApplyProof Web App

The web client for [ApplyProof](../README.md). It lets you view your job application records from a browser.

> **Status:** planned. Nothing here is implemented yet.

## What it does

- Show the same application records that sync from the mobile app.
- Talk to the [ApplyProof API](../backend/README.md) over HTTPS.

Proof images are not available on the web. They live only on the device where they were captured.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| Language | TypeScript |
| Backend | [ApplyProof API](../backend/README.md) |

The framework and tooling are a starting assumption and can change.

## Prerequisites

- Node.js 20 or newer

## Getting Started

```bash
# from the webApp directory
npm install
npm run dev
```

Set the backend address:

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (assumes a Vite setup) |

## Tests

```bash
npm test
```

## Related

- [Backend](../backend/README.md)
- [Mobile app](../mobileApp/README.md)