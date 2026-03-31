# Üst Seviye Tasarım Dokümanı (HLD)

---

## DOKÜMAN TARİHÇESİ

| Sürüm | Tarih      | Değişikliği Yapan | Değişiklik Açıklaması       |
|-------|------------|-------------------|-----------------------------|
| 1.0   | 30.03.2026 |                   | İlk versiyon hazırlanmıştır |

---

## DOKÜMAN KONTROL

| Kontrol Eden | Görevi | Onay Tarihi | İmza |
|--------------|--------|-------------|------|
|              |        |             |      |

---

## DOKÜMAN ONAY

| Onaylayan | Görevi | Onay Tarihi | İmza |
|-----------|--------|-------------|------|
|           |        |             |      |

---

## REFERANS DOKÜMANLAR

| Ref # | Doküman Adı                    | Türü                  |
|-------|--------------------------------|-----------------------|
| 1     | package.json                   | Bağımlılık Manifestosu |
| 2     | docker-compose.yml             | Altyapı Konfigürasyonu |
| 3     | src/store/store.md             | Mimari Rehber          |
| 4     | AYAGA_KALDIRMA.md              | Kurulum Kılavuzu       |

---

## TANIMLAR VE KISALTMALAR

| Terim    | Açıklama                                                                              |
|----------|---------------------------------------------------------------------------------------|
| HLD      | Üst Seviye Tasarım Dokümanı (High Level Design)                                       |
| SPA      | Single Page Application — tek sayfa uygulaması                                        |
| Redux    | Merkezi durum yönetim kütüphanesi                                                     |
| WebSocket| Çift yönlü, gerçek zamanlı iletişim protokolü                                         |
| REST     | Representational State Transfer — HTTP tabanlı API mimarisi                           |
| NATS     | Yüksek performanslı mesajlaşma sistemi; backend servisler arası iletişimde kullanılır |
| Redis    | Bellek içi veri yapısı deposu; mesaj broker olarak kullanılabilir                     |
| PostgreSQL | İlişkisel veritabanı yönetim sistemi                                                |
| Caddy    | Otomatik HTTPS destekli web sunucusu / ters proxy                                     |
| i18n     | Internationalization — uluslararasılaştırma                                           |
| SSO      | Single Sign-On — tek oturum açma                                                      |
| OIDC     | OpenID Connect — kimlik doğrulama protokolü                                           |

---

## İÇİNDEKİLER

1. Giriş
   - 1.1 Amaç
   - 1.2 Kapsam
2. Üst Seviye Tasarım
   - 2.1 Mevcut (As-Is) Uygulama Entegrasyon Mimarisi
   - 2.2 Hedef (To-Be) Uygulama Entegrasyon Mimarisi
   - 2.3 Etkilenen Sistemler / Uygulamalar / Servisler
   - 2.4 Migration Stratejisi
3. Sistem Donanım ve Network Genel Yapısı
   - 3.1 Yeni / İlave Donanım Gereksinimi
   - 3.2 Yeni / İlave Yazılım & Diğer Gereksinim
   - 3.3 Yedeklilik Yapısı ve Gereksinimleri
4. Akış Diyagramları
5. Varsayımlar
6. Bağımlılıklar
7. Kısıtlar
8. Riskler

---

## 1. GİRİŞ

### 1.1 Amaç

Bu doküman, Kazancı Holding bünyesinde geliştirilen **Aksa Retrospektif** web uygulamasının üst seviye teknik tasarımını tanımlar. Uygulama; yazılım geliştirme ekiplerine çevrimiçi, gerçek zamanlı retrospektif toplantılar düzenleme imkânı sunar. Pano oluşturma, not ekleme, oylama, zamanlayıcı, şablon yönetimi ve dışa aktarma gibi temel işlevleri kapsar.

### 1.2 Kapsam

Bu doküman aşağıdaki kapsamı içermektedir:

- React tabanlı frontend SPA mimarisi
- Go tabanlı backend REST + WebSocket API mimarisi
- PostgreSQL veritabanı katmanı
- NATS / Redis mesajlaşma altyapısı
- Kimlik doğrulama (anonim, Google, Microsoft, GitHub, Apple, OIDC)
- Docker tabanlı konteyner dağıtım mimarisi
- Caddy ters proxy ve HTTPS yapılandırması
- Temel uygulama modülleri: Pano, Sütun, Not, Oylama, Zamanlayıcı, Şablon, Dışa Aktarma

---

## 2. ÜST SEVİYE TASARIM

### 2.1 Mevcut (As-Is) Uygulama Entegrasyon Mimarisi

Uygulamanın önceki versiyonu bulunmamaktadır. Aksa Retrospektif, açık kaynak **scrumlr.io** projesinin Kazancı Holding ihtiyaçlarına göre özelleştirilmiş versiyonudur. Bu doküman, uygulamanın ilk kurumsal sürümünü (v4.5.0) kapsamaktadır.

### 2.2 Hedef (To-Be) Uygulama Entegrasyon Mimarisi

Uygulama, birbirinden bağımsız çalışan iki ana servisten oluşur: **Frontend** (React SPA) ve **Backend** (Go REST/WebSocket API). Bu iki servis, Caddy ters proxy arkasında aynı origin üzerinden sunulur.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          KULLANICI TARAYICISI                       │
│                     React SPA (aksa-frontend)                       │
│   Redux Store │ React Router │ i18n │ WebSocket Client (sockette)   │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP REST + WebSocket (/api)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CADDY (Ters Proxy)                           │
│              /api  →  aksa-backend:8080                             │
│              /*    →  aksa-frontend:8080                            │
└──────────────┬──────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     AKSA BACKEND (Go)                                │
│   REST API │ WebSocket Hub │ Auth (OIDC/OAuth2) │ Board/Note/Vote   │
└──────┬──────────────────────────────┬───────────────────────────────┘
       │                              │
       ▼                              ▼
┌─────────────┐              ┌────────────────────┐
│  PostgreSQL │              │  NATS / Redis      │
│  (Veriler)  │              │  (Mesajlaşma)      │
└─────────────┘              └────────────────────┘
```

**Frontend Katman Yapısı:**

```
src/
├── routes/          → Sayfa bileşenleri ve yönlendirme (React Router)
├── components/      → Yeniden kullanılabilir UI bileşenleri
├── store/           → Redux Toolkit durum yönetimi
│   └── features/    → auth, board, columns, notes, votes, participants...
├── api/             → Backend HTTP/WebSocket istemcileri
├── utils/           → Yardımcı fonksiyonlar (export, toast, hash...)
├── i18n/            → Türkçe çeviri dosyaları
└── assets/          → Statik kaynaklar
```

**Gerçek Zamanlı İletişim Akışı:**

Pano üzerindeki tüm değişiklikler (not ekleme, oylama, sütun güncelleme vb.) WebSocket üzerinden gerçekleşir:

```
Kullanıcı Eylemi
  → Redux Thunk dispatch
  → Backend WebSocket mesajı
  → Backend veritabanını günceller
  → Backend tüm bağlı istemcilere event yayar
  → Frontend event'i alır → Redux action dispatch
  → Store güncellenir → Bileşenler yeniden render edilir
```

### 2.3 Etkilenen Sistemler / Uygulamalar / Servisler

| Sıra | Sistem / Uygulama Adı | Alt Sistem / Modül Adı | Etkilenme Şekli | Vendor'a CR | Açıklama |
|------|-----------------------|------------------------|-----------------|-------------|----------|
| 1    | Aksa Frontend         | React SPA              | New             | Hayır       | Yeni kurumsal retrospektif uygulaması |
| 2    | Aksa Backend          | Go REST/WebSocket API  | New             | Hayır       | Pano, not, oylama, auth servisleri |
| 3    | PostgreSQL            | Veritabanı             | New             | Hayır       | Tüm uygulama verilerinin kalıcı depolanması |
| 4    | NATS / Redis          | Mesaj Broker           | New             | Hayır       | Backend servisler arası gerçek zamanlı mesajlaşma |
| 5    | Caddy                 | Ters Proxy             | New             | Hayır       | HTTPS sonlandırma ve yönlendirme |

### 2.4 Migration Stratejisi

Migrasyon yapılmayacaktır. Uygulama sıfırdan kurulmaktadır.

---

## 3. SİSTEM DONANIM VE NETWORK GENEL YAPISI

Uygulama Docker konteynerları üzerinde çalışmaktadır. Web uygulamasına bağlantı adresine sahip herkes erişebilmelidir. Log ve monitoring altyapısı sunuculara erişebilir olmalıdır.

### 3.1 Yeni / İlave Donanım Gereksinimi

Mevcut sunucu altyapısı üzerinde Docker Engine kurulu olması yeterlidir. Ek fiziksel donanım gerekmemektedir.

### 3.2 Yeni / İlave Yazılım & Diğer Gereksinim

| Sıra No | İlgili Sistem    | Yazılım Detayı                                    | Yeni / Lisans Bilgisi |
|---------|------------------|---------------------------------------------------|-----------------------|
| 01      | Aksa Frontend    | Node.js v24, React 18, TypeScript 5, Yarn 4       | MIT / Açık Kaynak     |
| 02      | Aksa Backend     | Go (son kararlı sürüm)                            | BSD / Açık Kaynak     |
| 03      | Veritabanı       | PostgreSQL 18.1                                   | PostgreSQL Lisansı    |
| 04      | Mesajlaşma       | NATS 2.12.3 veya Redis 8.4.0                      | Apache 2.0 / BSD      |
| 05      | Ters Proxy       | Caddy 2.10.2                                      | Apache 2.0            |
| 06      | Konteyner        | Docker Engine + Docker Compose                    | Apache 2.0            |

### 3.3 Yedeklilik Yapısı ve Gereksinimleri

Veritabanları genel veritabanı yönetimi politikası kapsamında yedeklenmelidir.

| Sıra No | İlgili Sistem | Yazılım Detayı | Yedekleme Periyodu                  |
|---------|---------------|----------------|-------------------------------------|
| 01      | PostgreSQL    | postgres_data volume | Günlük, Saklama süresi: Haftalık |
| 02      | Aksa Backend  | Docker Image   | Her deployment öncesi image tag'lenir |

---

## 4. AKIŞ DİYAGRAMLARI

### Kullanıcı Kimlik Doğrulama Akışı

```
Kullanıcı → /login sayfası
  ├── Anonim Giriş → POST /api/login/anonymous → Session Cookie → /boards
  ├── Google / Microsoft / GitHub → OAuth2 yönlendirme → Callback → Session Cookie → /boards
  └── OIDC → Discovery URL → Token doğrulama → Session Cookie → /boards
```

### Pano Oluşturma ve Katılım Akışı

```
Moderatör
  → POST /api/boards (ad, erişim politikası, sütunlar)
  → Board ID alınır → /board/:boardId yönlendirilir
  → WebSocket bağlantısı kurulur

Katılımcı
  → /board/:boardId URL'sine gider
  → Erişim politikasına göre: Açık / Şifreli / Davetli
  → WebSocket bağlantısı kurulur
  → Pano durumu senkronize edilir
```

### Not Ekleme Akışı (Gerçek Zamanlı)

```
Kullanıcı → Not alanına yazar → "Ekle" butonuna tıklar
  → dispatch(addNote) thunk
  → WebSocket: NOTE_ADD mesajı → Backend
  → Backend PostgreSQL'e kaydeder
  → Backend tüm bağlı istemcilere NOTE_ADDED event yayar
  → Her istemci: dispatch(addedNote) → Redux store güncellenir
  → Tüm katılımcıların ekranında not görünür
```

### Dışa Aktarma Akışı

```
Moderatör → Ayarlar → Panoyu Dışa Aktar
  ├── CSV  → GET /api/boards/:id/export (Accept: text/csv) → Dosya indirilir
  ├── JSON → GET /api/boards/:id/export (Accept: application/json) → Dosya indirilir
  ├── PDF  → PrintView DOM render → react-to-print → Tarayıcı yazdırma diyaloğu
  ├── PNG  → PrintView DOM render → html2canvas → canvas.toBlob → file-saver
  └── JPG  → PrintView DOM render → html2canvas → canvas.toBlob (image/jpeg, 0.92) → file-saver
```

---

## 5. VARSAYIMLAR

| ID   | Varsayım                                                                      | Sebebi                                                  | Etkisi                                                          |
|------|-------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------------------|
| VAR1 | Sunucular Docker Engine kurulu ve internet erişimine sahiptir                 | Konteyner tabanlı dağıtım tercih edilmiştir             | Docker kurulu olmayan ortamlarda uygulama çalışmaz              |
| VAR2 | PostgreSQL veritabanı sunucusu backend ile aynı Docker ağında erişilebilirdir | docker-compose ile aynı ağda tanımlanmıştır             | Ağ izolasyonu sorunlarında backend veritabanına erişemez        |
| VAR3 | Kullanıcılar modern tarayıcı kullanmaktadır (Chrome, Firefox, Edge son sürüm) | React 18 ve WebSocket API modern tarayıcı gerektirir    | Eski tarayıcılarda uygulama düzgün çalışmayabilir               |
| VAR4 | OAuth2 / OIDC sağlayıcıları (Google, Microsoft vb.) erişilebilir durumdadır  | Sosyal giriş için dış servis bağımlılığı mevcuttur      | Sağlayıcı erişilemezse yalnızca anonim giriş kullanılabilir     |
| VAR5 | NATS veya Redis servislerinden en az biri çalışır durumdadır                  | Backend mesajlaşma için bu servislerden birine ihtiyaç duyar | İkisi de çalışmazsa gerçek zamanlı senkronizasyon durur    |

---

## 6. BAĞIMLILIKLAR

| ID   | Açıklama                                                                                         |
|------|--------------------------------------------------------------------------------------------------|
| BAG1 | Aksa Backend servisi, PostgreSQL veritabanı hazır olmadan başlayamaz (healthcheck bağımlılığı)   |
| BAG2 | Aksa Frontend servisi, Aksa Backend servisi hazır olmadan başlayamaz (healthcheck bağımlılığı)   |
| BAG3 | Gerçek zamanlı özellikler NATS veya Redis mesaj broker'ına bağımlıdır                           |
| BAG4 | Sosyal giriş özellikleri (Google, Microsoft, GitHub, Apple) ilgili OAuth2 client ID/secret'larına bağımlıdır |
| BAG5 | Frontend build süreci Node.js v24 ve Yarn 4 gerektirmektedir                                    |
| BAG6 | PDF dışa aktarma `react-to-print` kütüphanesine, görüntü dışa aktarma `html2canvas` ve `file-saver` kütüphanelerine bağımlıdır |

---

## 7. KISITLAR

| ID   | Açıklama                                                                                                        |
|------|-----------------------------------------------------------------------------------------------------------------|
| KST1 | Uygulama yalnızca Türkçe arayüz sunmaktadır; çok dilli destek mevcut sürümde kapsam dışındadır                 |
| KST2 | Gerçek zamanlı senkronizasyon WebSocket bağlantısı gerektirmektedir; WebSocket engelleyen ağ ortamlarında çalışmaz |
| KST3 | Anonim kullanıcılar oturum kapatıp tekrar giriş yaptıklarında önceki verilerine erişemez                        |
| KST4 | Görüntü dışa aktarma (PNG/JPG) yalnızca tarayıcı ortamında çalışır; sunucu taraflı render desteklenmez          |
| KST5 | Pano erişim politikaları üç seçenekle sınırlıdır: Açık, Şifreli, Davetli                                       |

---

## 8. RİSKLER

| ID   | Açıklama                                                                                                                              |
|------|---------------------------------------------------------------------------------------------------------------------------------------|
| RSK1 | PostgreSQL veritabanı erişilemez hale gelirse tüm uygulama işlevselliği durur; yedekleme ve yüksek erişilebilirlik planı gereklidir   |
| RSK2 | WebSocket bağlantısı kesilirse gerçek zamanlı senkronizasyon bozulur; `sockette` kütüphanesi otomatik yeniden bağlanma sağlar         |
| RSK3 | Yüksek eş zamanlı kullanıcı sayısında NATS/Redis mesaj kuyruğu darboğaz oluşturabilir; yatay ölçeklendirme planlanmalıdır             |
| RSK4 | OAuth2 sağlayıcılarının API değişiklikleri kimlik doğrulama akışını bozabilir; sağlayıcı güncellemeleri takip edilmelidir             |
| RSK5 | `html2canvas` kütüphanesi karmaşık CSS içeren bileşenleri hatalı render edebilir; görüntü dışa aktarma kalitesi test edilmelidir      |

---

*Kazancı Holding | Dahili | Kişisel Veri İçermez*
