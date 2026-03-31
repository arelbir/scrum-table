# Yapılandırma

## .env Dosyası

`deployment/docker/.env` dosyası temel ayarları içerir. Örnek içerik:

```env
AKSA_INSECURE=true
POSTGRES_USER=aksa
POSTGRES_PASSWORD=supersecret
POSTGRES_DB=aksa
```

## Backend Değişkenleri

Aşağıdaki değişkenler opsiyoneldir ve `docker-compose.yml` üzerinden aktarılır:

- `AKSA_SERVER_PORT`
- `AKSA_SERVER_DATABASE_URL`
- `AKSA_SERVER_NATS_URL`
- `AKSA_AUTH_*` (Google, GitHub, Microsoft, Apple, OIDC)
- `SESSION_SECRET`
- `AKSA_OTEL_GRPC`, `AKSA_OTEL_HTTP`

## Frontend Değişkenleri

- `AKSA_SERVER_URL`
- `AKSA_WEBSOCKET_URL`
- `AKSA_ANALYTICS_DATA_DOMAIN`
- `AKSA_ANALYTICS_SRC`
- `AKSA_CLARITY_ID`

## Öneriler

- Üretim ortamında `SESSION_SECRET` mutlaka tanımlanmalıdır.
- Kimlik sağlayıcıları kullanılacaksa `AKSA_AUTH_*` alanları doldurulmalıdır.
