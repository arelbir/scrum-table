# Backend Geliştirme

## Gereksinimler

- [Docker](https://www.docker.com/) + Docker Compose
- Go

## Yerel Çalıştırma

```bash
# Gerekli servisleri başlat (postgres + nats)
make run-docker-dev
# veya
docker compose --profile dev up

# Backend'i başlat
cd src/
go run . --database "postgres://admin:supersecret@localhost:5432/aksa?sslmode=disable" --disable-check-origin --insecure
```

Tüm CLI argümanları için: `go run . -h`

TOML dosyasıyla yapılandırma: `go run . --config config_example.toml`

## Mimari

Backend paketleri ve etkileşimleri:

```mermaid
flowchart TB
    api[API] --> boards & columns & notes & votings & sessions & users & reactions & health & feedback
    boards --> columns & notes & sessions
    columns --> notes & votings

    database@{ shape: cyl, label: "Veritabanı" }
    nats@{ shape: das, label: "Nats" }

    boards & columns & notes & votings & sessions & users & reactions & health --> database
    boards & columns & notes & votings & sessions & users & reactions & health --> nats
```

Her paket: **API → Servis → Veritabanı Erişimi** katmanlarından oluşur. Mesaj aracısı için `realtime` paketi kullanılır.

## Kod Standartları

- Editörde [.editorconfig](../../.editorconfig) aktif olmalı
- Commit öncesi otomatik biçimlendirme: `./scripts/setup-git-hooks.sh` (tek seferlik)
- Manuel: `make format` | Kontrol: `make format-check` | Lint: `make go-lint`

**VS Code** için `.vscode/settings.json`:
```json
{
  "go.formatTool": "goimports",
  "editor.formatOnSave": true
}
```

## İsimlendirme Kuralları

- Veritabanı arayüzü: `<Paket>Database`
- Servis arayüzü: `<Paket>Service`
- Metod isimleri: `Create`, `Update`, `Delete`, `Get`, `GetAll`, `Exists`
