# ApplyProof Backend

REST API for [ApplyProof](../README.md). It stores and syncs job application records between the user's devices.

> **Status:** work in progress.

## What it does

- Handles user sign-in.
- Receives and serves job application records (text only).
- Keeps records in MySQL so they are available across devices.

The backend never receives proof images. Those stay on the user's device.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot |
| Database | MySQL |
| API style | REST (JSON over HTTPS) |

## Prerequisites

- JDK 21
- Maven 3.9+ (or the included wrapper)
- MySQL 8 (local install or Docker)

## Getting Started

```bash
# from the backend directory
./mvnw spring-boot:run
```

Set the database connection before starting:

| Variable | Description |
|---|---|
| `DB_URL` | JDBC URL, e.g. `jdbc:mysql://localhost:3306/applyproof` |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |

## Tests

```bash
./mvnw test
```

## Related

- [Mobile app](../mobileApp/README.md)
- [Web app](../webApp/README.md)