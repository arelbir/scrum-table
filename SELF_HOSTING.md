# Self-Hosting (Kurulum)

## Gereksinimler

- Docker Desktop (Windows / macOS / Linux)
- İnternet bağlantısı (ilk build için)

## Lokal Kurulum

1. `deployment/docker` dizinine geçin.
2. Docker build ve çalıştırma:

```powershell
cd C:\Users\33589\Desktop\PROJELER\scrumgozde\scrumlr.io\deployment\docker
docker compose up -d --build
```

## Erişim

- Uygulama: `http://localhost`

## Varsayılan Portlar

- Frontend: `80`
- Backend: `8080`
- Postgres: `5432`
- NATS: `4222`

## Durdurma

```powershell
docker compose down
```

## Temizleme

```powershell
docker compose down -v
```
