# Architecture Overview 🏗️

MooNsPlanner is built as a modern web application inside a monorepo structure.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Zustand, Tailwind CSS (optional), Lucide Icons
- **Backend:** NestJS, TypeScript, TypeORM
- **Database:** MariaDB (default), SQLite (fallback/testing)
- **Maps Integration:** Leaflet.js, OpenStreetMap, Overpass API, Nominatim

## Monorepo Structure

```text
MooNsPlanner/
├── client/              # React frontend (Vite + TypeScript)
├── server/              # NestJS backend
├── shared/              # Shared TypeScript definitions, Enums, Utils
├── plugin-sdk/          # SDK for developing custom extensions
└── charts/              # Helm chart for Kubernetes deployment
```

## Key Backend Services

1. **Atlas Service:** Manages countries, cities, and user travel statistics.
2. **Maps Service:** Interfaces with OSM, Overpass, and Wikimedia for map metadata and images.
3. **Trip Service:** Core logic for creating, managing, and collaborating on travel itineraries.
4. **Auth Service:** Handles JWT issuance, OIDC/SSO integrations, and standard local auth.
