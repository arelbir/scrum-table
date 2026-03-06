# Uygulamayı Ayağa Kaldırma (Windows / PowerShell)

Bu doküman `scrumlr.io` projesini lokal ortamda hızlıca çalıştırmak içindir.

## 1) Ön Koşullar

- Docker Desktop (çalışır durumda)
- PowerShell
- (Opsiyonel) Node.js + Yarn (`yarn start` için)

## 2) Docker ile Tam Sistem (Önerilen)

> Bu yöntem frontend + backend + postgres + nats + caddy servislerini birlikte ayağa kaldırır.

### Adım 1: Docker klasörüne geç

```powershell
cd C:\Users\33589\Desktop\PROJELER\scrumgozde\scrumlr.io\deployment\docker
```

### Adım 2: Temizden başlat (opsiyonel ama önerilir)

```powershell
docker compose down
```

### Adım 3: Build + run

```powershell
docker compose up -d --build
```

### Adım 4: Servis durumunu kontrol et

```powershell
docker compose ps
```

### Adım 5: Uygulamayı aç

- Frontend: `http://localhost:3001`
- Backend health: `http://localhost:3001/api`

> Not: Port eşlemesi compose dosyasında `3001:80` olarak ayarlı.

---

## 3) Log ve Hata Kontrolü

### Son loglar

```powershell
docker compose logs --tail 200
```

### Belirli servis logu

```powershell
docker compose logs --tail 200 aksa-frontend
docker compose logs --tail 200 aksa-backend
```

---

## 4) Durdurma / Temizleme

### Servisleri durdur

```powershell
docker compose down
```

### Tüm volume'leri de temizle (veritabanı dahil)

```powershell
docker compose down -v
```

---

## 5) Sık Karşılaşılan Sorunlar

## A) PowerShell'de `&&` hatası

PowerShell'de bazı sürümlerde `&&` çalışmaz. Bunun yerine `;` kullan:

```powershell
docker compose down; docker compose up -d --build
```

## B) Frontend build hatası (`RUN yarn build`)

1. Önce temiz build al:

```powershell
docker compose down
docker builder prune -f
docker compose up -d --build
```

2. `src/assets/aksa-logo.svg` dosyasının geçerli SVG metni içerdiğini doğrula (binary/bozuk içerik olmamalı).

## C) Port çakışması

- `3001` doluysa `deployment/docker/docker-compose.yml` içindeki caddy `ports` kısmını değiştir.

---

## 6) Docker'sız Frontend Geliştirme (Opsiyonel)

Bu mod sadece frontend içindir:

```powershell
cd C:\Users\33589\Desktop\PROJELER\scrumgozde\scrumlr.io
yarn install
yarn start
```

- Frontend dev server: genelde `http://localhost:3000`
- Backend'e istekler için backend servisinin ayrıca çalışıyor olması gerekir.
