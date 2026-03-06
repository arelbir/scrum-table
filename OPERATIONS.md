# Operasyonlar

## Loglar

```powershell
docker compose logs --tail 200
```

## Yedekleme (Postgres)

Basit yedekleme örneği:

```powershell
docker exec -i postgres pg_dump -U aksa aksa > backup.sql
```

## Güncelleme

1. Kod güncellemesini çekin.
2. Yeniden build alın:

```powershell
docker compose up -d --build
```

## Sağlık Kontrolü

```powershell
docker compose ps
```

Servislerin `healthy` olduğundan emin olun.
