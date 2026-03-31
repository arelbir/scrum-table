# Kurulum ve İşletim

## Gereksinimler

- Docker Desktop (Windows / macOS / Linux)
- Git

> Node.js veya Yarn gerekmez. Tüm servisler Docker içinde çalışır.

## Hızlı Başlangıç

```powershell
git clone https://github.com/arelbir/scrum-table.git
cd scrum-table\deployment\docker
docker compose up -d --build
```

Uygulama: `http://localhost:3001` | Backend: `http://localhost:3001/api`

## Servis Durumu

```powershell
docker compose ps
docker compose logs --tail 200
docker compose logs --tail 200 aksa-frontend   # belirli servis
```

## Güncelleme

```powershell
git pull
docker compose up -d --build
```

## Durdurma ve Temizleme

```powershell
docker compose down          # servisleri durdur
docker compose down -v       # volume'leri de temizle (veritabanı dahil)
```

## Yedekleme

```powershell
docker exec -i postgres pg_dump -U aksa aksa > backup.sql
```

## Sık Karşılaşılan Sorunlar

**Port çakışması (`3001` dolu)**
`deployment/docker/docker-compose.yml` içindeki caddy `ports` kısmını değiştirin.

**Frontend build hatası**
```powershell
docker compose down
docker builder prune -f
docker compose up -d --build
```

**Veritabanı bağlantı hatası (`password authentication failed`)**
Eski volume farklı şifreyle oluşturulmuş olabilir:
```powershell
docker compose down -v
docker compose up -d
```

**PowerShell'de `&&` hatası**
`&&` yerine `;` kullanın:
```powershell
docker compose down; docker compose up -d --build
```

## Yalnızca Frontend Geliştirme (Docker'sız)

```powershell
cd scrumlr.io
yarn install
yarn start   # http://localhost:3000
```

Backend'in ayrıca çalışıyor olması gerekir.
