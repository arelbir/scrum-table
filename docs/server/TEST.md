# Test ve Yapılacaklar

## Testleri Çalıştırma

```bash
make test
# veya
cd src && go test ./... -cover -coverprofile=coverage.txt
```

Kapsam raporu:
```bash
cat coverage.txt | grep -v "mock" > coverage.out
go tool cover -html=coverage.out -o coverage.html
# veya
make coverage
```

## Mock Oluşturma

[Mockery](https://vektra.github.io/mockery/latest/) kullanılır.

```bash
# macOS
brew install mockery

# Linux — github.com/vektra/mockery/releases'den indirip PATH'e ekleyin
```

```bash
cd src && mockery
# veya
make mockery
```

Yapılandırma: `src/.mockery.yaml`

## E2E Testleri

```bash
make run-docker   # veya: docker compose up
# e2e-tests klasöründe:
go test ./...
```

## Yapılacaklar

- `common` paketini kaldır
- API endpoint'lerini ilgili paketlerine taşı
- Modelleri yalnızca ID içerecek şekilde güncelle ve frontend'i buna göre ayarla
- Veritabanı testlerini yeniden yaz
- `sessionrequests` paketinde `Create`+`Update` → `Upsert`
- Mantığı veritabanı sorgularından servislere taşı
- OpenAPI belgeleri ekle
- Log seviyesini ortam değişkeniyle yapılandır
