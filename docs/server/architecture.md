# Backend Mimarisi

Aşağıdaki diyagramda backend paketleri ve birbirleriyle nasıl etkileşime girdikleri gösterilmektedir.

```mermaid
%%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%
flowchart TB
    api[API]
    boards[Panolar]
    boardTemplates[Pano Şablonları]
    boardReactions[Pano Tepkileri]
    columns[Sütunlar]
    columnTemplates[Sütun Şablonları]
    notes[Notlar]
    votings[Oylamalar]
    sessions[Oturumlar]
    sessionRequests[Oturum İstekleri]
    users[Kullanıcılar]
    reactions[Tepkiler]
    health[Sağlık]
    feedback[Geri Bildirim]

    database@{ shape: cyl, label: "Veritabanı" }
    nats@{ shape: das, label: "Nats" }

    api --> boards
    api --> boardTemplates
    api --> boardReactions
    api --> columns
    api --> columnTemplates
    api --> notes
    api --> votings
    api --> sessions
    api --> sessionRequests
    api --> users
    api --> reactions
    api --> health
    api --> feedback

    boards --> columns
    boards --> notes
    boards --> sessions

    columns --> notes
    columns --> votings

    sessionRequests --> sessions

    boards --> database
    boardTemplates --> database
    columns --> database
    columnTemplates --> database
    notes --> database
    votings --> database
    sessions --> database
    sessionRequests --> database
    users --> database
    reactions --> database
    health --> database

    boards --> nats
    boardReactions --> nats
    columns --> nats
    notes --> nats
    votings --> nats
    sessions --> nats
    sessionRequests --> nats
    users --> nats
    reactions --> nats
    health --> nats
```

## Paket Yapısı

Genel paket yapısı aşağıdaki diyagramda gösterilmektedir.

```mermaid
flowchart TB
    subgraph "Paket"
        api[API]
        service[Servis]
        databaseAccess[Veritabanı Erişimi]
        api --> service
        service --> databaseAccess
    end

    database@{ shape: cyl, label: "Veritabanı" }
    nats@{ shape: das, label: "Nats" }

    service --> nats
    databaseAccess --> database
```

Her paketin en az bir API ve bir servisi vardır. Servisin veritabanına erişmesi gerekiyorsa bir veritabanı erişim katmanı oluşturulur. Servisin kendi kontrolünde olmayan bir veritabanına erişmesi gerekiyorsa ilgili servis enjekte edilir. Mesaj aracısına erişim için `realtime` paketi kullanılır.
