# ApplyProof Mobile App

The main [ApplyProof](../README.md) app. Track every job application and keep proof of submission on your own device.

> **Status:** work in progress.

## What it does

- Record job applications: company, role, location, date and time, status.
- Attach proof by camera or screenshot import.
- Store proof images on the device, not in the cloud.
- Work offline, and sync text records with the backend when online.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native with Expo |
| Language | TypeScript |
| Local database | SQLite |
| Proof storage | Device file system |
| Backend | [ApplyProof API](../backend/README.md) over HTTPS |

## Prerequisites

- Node.js 20 or newer
- Android Studio (Android) and/or Xcode (iOS)

This app needs an Expo **development build**. Expo Go does not support all the native features used here.

## Getting Started

```bash
# from the mobileApp directory
npm install
npx expo run:android   # or: npx expo run:ios
```

Set the backend address:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Base URL of the backend API |

Do not put secrets in `EXPO_PUBLIC_*` variables. They are bundled into the app.

## Tests

```bash
npm test
```

## Related

- [Backend](../backend/README.md)
- [Web app](../webApp/README.md)