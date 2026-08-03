<div align="center">

# 🌙 MooNsPlanner

**Self-hosted travel planning and exploration platform**

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/schowdary75/MooNsPlanner?style=social)](https://github.com/schowdary75/MooNsPlanner)

---

*Plan your adventures. Own your data. No tracking, no subscriptions.*

</div>

## ✨ Features

- 🗺️ **Trip Planning** — Create and organize multi-day travel itineraries with drag-and-drop
- 📍 **Interactive Maps** — Explore destinations with integrated mapping and POI discovery
- ✈️ **Flight Tracking** — Import and track flights with airport data and route mapping
- 🏨 **Booking Import** — Import reservations from email confirmations via AI parsing
- 💰 **Budget Tracking** — Track expenses across trips with multi-currency support
- 🔔 **Notifications** — Get trip reminders via email, in-app, or webhooks (Slack, etc.)
- 🌍 **Atlas & Collections** — Track visited countries and save places to curated collections
- 🔌 **Plugin System** — Extend functionality with a built-in plugin SDK
- 🌐 **Multi-language** — Available in 20+ languages
- 🔐 **SSO / OIDC** — Enterprise-ready authentication with OpenID Connect
- 📱 **PWA** — Installable progressive web app that works on any device
- 🐳 **Docker Ready** — One-command deployment with Docker Compose

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 19, TypeScript, Vite        |
| Backend     | NestJS, TypeScript                |
| Database    | MariaDB / SQLite                  |
| Maps        | Leaflet, Overpass API             |
| Auth        | JWT, OIDC, MFA                    |
| Deploy      | Docker, Helm, Unraid              |

## 🚀 Quick Start

### Docker Compose (Recommended)

```bash
git clone https://github.com/schowdary75/MooNsPlanner.git
cd MooNsPlanner
cp server/.env.example server/.env
# Edit server/.env with your settings
docker compose up -d
```

Visit `http://localhost:3001` — an admin account is created on first boot (check the logs for the password).

### From Sources

```bash
git clone https://github.com/schowdary75/MooNsPlanner.git
cd MooNsPlanner
npm install
npm run dev
```

See [build-from-sources](build-from-sources) for detailed instructions.

## ⚙️ Configuration

All configuration is done via environment variables. See [`.env.example`](server/.env.example) for the full list.

Key settings:

| Variable           | Description                              | Default     |
|--------------------|------------------------------------------|-------------|
| `PORT`             | Server port                              | `3001`      |
| `NODE_ENV`         | `development` or `production`            | `development` |
| `ALLOWED_ORIGINS`  | CORS origins (comma-separated)           | —           |
| `FORCE_HTTPS`      | Enable HTTPS redirect & HSTS             | `false`     |
| `MARIADB_HOST`     | MariaDB hostname                         | `127.0.0.1` |
| `MARIADB_PORT`     | MariaDB port                             | `3306`      |
| `MARIADB_USER`     | MariaDB username                         | `root`      |
| `MARIADB_PASSWORD` | MariaDB password                         | —           |
| `MARIADB_DATABASE` | MariaDB database name                    | `moons`     |

## 📁 Project Structure

```
MooNsPlanner/
├── client/          # React frontend (Vite)
├── server/          # NestJS backend
├── shared/          # Shared types, i18n, utilities
├── plugin-sdk/      # Plugin development SDK
├── charts/          # Helm chart for Kubernetes
├── scripts/         # Utility scripts
├── docker-compose.yml
└── Dockerfile
```

## 🔒 Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

This project is **proprietary software**. All rights reserved.
See [LICENSE](LICENSE) for details.

**You may NOT modify, redistribute, or use this software commercially without explicit written permission.**

## 👤 Author

**MooN** — [@schowdary75](https://github.com/schowdary75)

---

<div align="center">
<sub>Built with ☕ and late nights by MooN</sub>
</div>
