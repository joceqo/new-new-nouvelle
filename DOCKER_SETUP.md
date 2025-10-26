# Docker Setup for Nouvelle

This project uses Docker to run Convex (self-hosted backend) and Ollama (local AI) services.

## Services Included

1. **Convex Backend** - Self-hosted Convex backend for real-time data sync
   - Port: 3210 (backend)
   - Port: 3211 (site)

2. **Convex Dashboard** - Web UI for inspecting Convex data
   - Port: 6791
   - Optional (use `--profile dashboard`)

3. **Ollama** - Local AI models
   - Port: 11434

## Quick Start

### Start Core Services (Convex Backend + Ollama)

```bash
npm run docker:up
```

### Start with Dashboard

```bash
npm run docker:up:dashboard
```

### Stop All Services

```bash
npm run docker:down
```

### Stop and Remove Volumes (Clean Slate)

```bash
npm run docker:down:clean
```

### View Logs

```bash
npm run docker:logs
```

### Check Running Containers

```bash
npm run docker:ps
```

### Restart Services

```bash
npm run docker:restart
```

## Accessing Services

- **Convex Backend**: http://localhost:3210
- **Convex Dashboard**: http://localhost:6791 (if started with `--profile dashboard`)
- **Ollama API**: http://localhost:11434

## Environment Variables

All configuration is in `.env` file at the project root. Key variables:

- `CONVEX_SELF_HOSTED_URL` - Convex backend URL
- `CONVEX_SELF_HOSTED_ADMIN_KEY` - Admin key for Convex
- `OLLAMA_ENDPOINT` - Ollama API endpoint
- `RESEND_API_KEY` - Email service API key

## Logs

View logs for all services:
```bash
npm run docker:logs
```

View logs for specific service:
```bash
docker compose logs -f convex-backend
docker compose logs -f ollama
```

## Health Checks

Check if services are healthy:
```bash
npm run docker:ps
```

## Next Steps

1. Start the Docker services: `npm run docker:up:dashboard`
2. Run your development servers: `npm run dev:web:all`
3. Your API will connect to Convex running in Docker
4. Access the Convex Dashboard at http://localhost:6791 to inspect your data

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run docker:up` | Start core services (Convex + Ollama) |
| `npm run docker:up:dashboard` | Start all services including dashboard |
| `npm run docker:down` | Stop all services |
| `npm run docker:down:clean` | Stop and remove all data volumes |
| `npm run docker:logs` | View logs from all services |
| `npm run docker:ps` | Check status of running containers |
| `npm run docker:restart` | Restart all services |
