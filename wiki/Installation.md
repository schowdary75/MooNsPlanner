# Installation Guide 🛠️

This page provides detailed installation instructions for MooNsPlanner. 

## Option 1: Docker Compose (Recommended for Production)

Docker is the easiest and most reliable way to run MooNsPlanner in production.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/schowdary75/MooNsPlanner.git
   cd MooNsPlanner
   ```

2. **Configure environment:**
   ```bash
   cp server/.env.example server/.env
   # Open server/.env in your favorite editor and configure the secrets
   ```

3. **Start the stack:**
   ```bash
   docker compose up -d
   ```
   *This starts the MariaDB database and the MooNsPlanner application.*

## Option 2: Quick Start Script (Recommended for Dev/Testing)

The project includes convenient start scripts that automate the build and run process.

**Linux / macOS:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

You can pass flags to the shell script:
- `./start.sh` (default, dev mode)
- `./start.sh --prod` (builds production bundles)
- `./start.sh --docker` (runs docker-compose)

## Option 3: Kubernetes / Helm

We provide a Helm chart in the `charts/moons` directory for Kubernetes deployments.

```bash
helm install moons ./charts/moons --namespace travel --create-namespace
```
*(Make sure to configure your `values.yaml` properly!)*
