<div align="center">

# ApplyProof

**Your applications. Your proof. Your device.**

A privacy-first job application tracker that helps you remember where you applied, when you applied, and what happened next.

![Status](https://img.shields.io/badge/status-work%20in%20progress-C9A27E)
![Expo](https://img.shields.io/badge/Expo-React%20Native-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)

</div>

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [The Idea](#the-idea)
3. [Tech Stack](#tech-stack)
4. [System Design](#system-design)

---

## Problem Statement

When you are job hunting, you do not apply to one or two companies. You apply to dozens, across job portals, company career pages, emails and referrals.

The problem starts later. A recruiter calls, and you cannot remember:

- which company this is,
- which role you applied for,
- when you applied,
- or where you applied from.

There is no single place that answers "what did I apply to, and what is happening with it?" Browser history, emails and screenshots scattered across a phone gallery are not a system, and the missed context makes you sound unprepared at the exact moment it matters most.

ApplyProof was built to solve this problem.

## The Idea

ApplyProof is a mobile app where every job application is recorded in one place, with the company, role, location, date and time, and its current status. When a recruiter calls, you open the app and know where you stand within seconds.

You can also attach **proof of submission**, such as a screenshot of the confirmation page. Proof images are stored on your own device, not in the cloud, so personal documents and account pages are never uploaded anywhere. Only the text details of an application are synced to the server.

The app is **offline-first**: it works without an internet connection, and syncing happens in the background when you are online.

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native (Expo), TypeScript |
| Local storage | SQLite for records, device file system for proof images |
| Backend | Java 21, Spring Boot |
| Database | MySQL |
| Communication | REST API over HTTPS (JSON) |

## System Design

### Architecture overview

ApplyProof uses a **local-first** design. The mobile app is fully usable on its own, and the backend exists to keep the text records safe and available across devices.

```mermaid
flowchart LR
    User(["Job seeker"])

    subgraph Device["User device"]
        App["Mobile app<br/>React Native Expo"]
        SQLite[("SQLite<br/>application records")]
        Files[/"Device storage<br/>proof images"/]
    end

    subgraph Backend["Backend"]
        API["Spring Boot API<br/>Java 21"]
        MySQL[("MySQL<br/>application records")]
    end

    User --> App
    App -->|"read and write"| SQLite
    App -->|"save proof images"| Files
    App ==>|"HTTPS: text records only"| API
    API --> MySQL
```

### How the pieces fit together

| Component | Role |
|---|---|
| Mobile app | The interface for adding, searching and tracking applications |
| SQLite | Local source of truth, so the app works offline |
| Device storage | Holds proof images; they never leave the device |
| Spring Boot API | Receives and serves application records |
| MySQL | Central storage for application records, available across devices |

### Where data lives

```mermaid
flowchart TB
    Data["Application data"]
    Data --> Text["Text records<br/>company, role, date, status"]
    Data --> Proof["Proof images"]
    Text --> L1["Device: SQLite"]
    Text --> L2["Server: MySQL"]
    Proof --> L3["Device only"]
```

| Data | On device | On server |
|---|---|---|
| Application details (company, role, location, date, status) | Yes | Yes |
| Proof images | Yes | **No** |

> **Core principle:** application details can be synchronized with the backend, but proof images stay on the user's device unless the user chooses to export or share them.

### Sync in brief

1. Every change is saved to SQLite first, so the app never waits on the network.
2. Pending changes are queued locally.
3. When the device is online, queued changes are sent to the backend and changes from other devices are fetched.
4. Only text records are transferred. The backend has no way to receive image files.
