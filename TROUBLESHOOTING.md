# Sorun Giderme

## Build Hatası

- `docker compose logs --tail 200` ile hatayı inceleyin.
- Node/Yarn cache sorunlarında tekrar build alın.

## Port Çakışması

- `80` veya `8080` doluysa ilgili servisi kapatın.
- Alternatif port için `docker-compose.yml` üzerinden portları değiştirin.

## Frontend Erişim Sorunu

- `caddy` ve `aksa-frontend` servislerinin çalıştığını kontrol edin.

## Veritabanı Bağlantı Sorunu

- `postgres` container durumunu kontrol edin.
- `POSTGRES_*` değişkenlerinin eşleştiğini doğrulayın.
