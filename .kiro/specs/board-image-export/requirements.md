# Gereksinimler Dokümanı

## Giriş

Bu doküman, Aksa Retrospektif uygulamasına PNG ve JPG formatlarında görüntü export özelliği eklenmesine ilişkin gereksinimleri tanımlar. Kullanıcılar mevcut "Panoyu Dışa Aktar" ekranından tek tıkla panonun anlık görüntüsünü indirebilecektir. Teknik yaklaşım olarak `html2canvas` kütüphanesi ile mevcut `PrintView` bileşeninin DOM render'ı yakalanacak, `file-saver` kütüphanesi ile dosya indirme işlemi gerçekleştirilecektir.

## Sözlük

- **ImageExporter**: PNG veya JPG formatında görüntü dosyası üreten ve indiren sistem bileşeni.
- **PrintView**: Panonun tüm sütun ve notlarını yazdırma düzeninde gösteren mevcut React bileşeni (`PrintView.tsx`).
- **ExportBoard**: Dışa aktarma seçeneklerini listeleyen ayarlar iletişim kutusu bileşeni (`ExportBoard.tsx`).
- **html2canvas**: Bir DOM düğümünü `<canvas>` öğesine dönüştüren JavaScript kütüphanesi.
- **file-saver**: Tarayıcı üzerinden dosya indirme işlemini yöneten mevcut kütüphane.
- **BoardData**: Pano adı, sütunlar, notlar, katılımcılar ve oylamalar dahil tüm pano verilerini kapsayan veri yapısı.
- **ExportFormat**: Desteklenen görüntü formatı; `png` veya `jpg` değerlerinden birini alır.

---

## Gereksinimler

### Gereksinim 1: PNG Olarak Dışa Aktarma

**Kullanıcı Hikayesi:** Bir retrospektif moderatörü olarak, panoyu PNG formatında indirmek istiyorum; böylece sunum veya arşiv amacıyla yüksek kaliteli, şeffaflık destekli bir görüntüye sahip olabilirim.

#### Kabul Kriterleri

1. THE `ExportBoard` SHALL "PNG olarak dışa aktar" etiketli ve `AddImage` ikonu içeren bir buton göstermelidir.
2. WHEN kullanıcı "PNG olarak dışa aktar" butonuna tıkladığında, THE `ImageExporter` SHALL `PrintView` bileşeninin DOM render'ını `html2canvas` ile yakalayarak bir PNG dosyası oluşturmalıdır.
3. WHEN PNG dosyası oluşturulduğunda, THE `ImageExporter` SHALL dosyayı `{YYYY-MM-DD}_{boardName}.png` adıyla kullanıcının cihazına indirmelidir.
4. THE `ImageExporter` SHALL PNG dosyasını oluştururken `html2canvas` seçeneği olarak `scale: 2` değerini kullanarak 2× piksel yoğunluğu sağlamalıdır.
5. IF `html2canvas` render işlemi başarısız olursa, THEN THE `ImageExporter` SHALL kullanıcıya Türkçe hata mesajı içeren bir toast bildirimi göstermelidir.

---

### Gereksinim 2: JPG Olarak Dışa Aktarma

**Kullanıcı Hikayesi:** Bir retrospektif moderatörü olarak, panoyu JPG formatında indirmek istiyorum; böylece daha küçük dosya boyutuyla paylaşım yapabilirim.

#### Kabul Kriterleri

1. THE `ExportBoard` SHALL "JPG olarak dışa aktar" etiketli ve `AddImage` ikonu içeren bir buton göstermelidir.
2. WHEN kullanıcı "JPG olarak dışa aktar" butonuna tıkladığında, THE `ImageExporter` SHALL `PrintView` bileşeninin DOM render'ını `html2canvas` ile yakalayarak bir JPG dosyası oluşturmalıdır.
3. WHEN JPG dosyası oluşturulduğunda, THE `ImageExporter` SHALL dosyayı `{YYYY-MM-DD}_{boardName}.jpg` adıyla kullanıcının cihazına indirmelidir.
4. THE `ImageExporter` SHALL JPG dosyasını oluştururken `image/jpeg` MIME türü ve `0.92` kalite değerini kullanmalıdır.
5. IF `html2canvas` render işlemi başarısız olursa, THEN THE `ImageExporter` SHALL kullanıcıya Türkçe hata mesajı içeren bir toast bildirimi göstermelidir.

---

### Gereksinim 3: Dışa Aktarma Sırasında Yükleme Durumu

**Kullanıcı Hikayesi:** Bir retrospektif moderatörü olarak, görüntü oluşturulurken görsel bir geri bildirim almak istiyorum; böylece işlemin devam ettiğini anlayabilirim.

#### Kabul Kriterleri

1. WHEN `ImageExporter` görüntü oluşturma işlemini başlattığında, THE `ExportBoard` SHALL ilgili butonu devre dışı bırakmalı ve yükleme göstergesi (spinner veya devre dışı stil) uygulamalıdır.
2. WHILE görüntü oluşturma işlemi devam ederken, THE `ExportBoard` SHALL PNG ve JPG butonlarının her ikisini de devre dışı bırakmalıdır.
3. WHEN görüntü oluşturma işlemi tamamlandığında veya hata oluştuğunda, THE `ExportBoard` SHALL butonları tekrar etkin hale getirmelidir.

---

### Gereksinim 4: Görüntü İçeriği ve Düzeni

**Kullanıcı Hikayesi:** Bir retrospektif moderatörü olarak, dışa aktarılan görüntünün mevcut PDF print view ile tutarlı içerik ve düzene sahip olmasını istiyorum; böylece tüm export formatları arasında görsel bütünlük sağlanır.

#### Kabul Kriterleri

1. THE `ImageExporter` SHALL görüntüyü oluştururken mevcut `PrintView` bileşeninin DOM render'ını kaynak olarak kullanmalıdır.
2. THE `ImageExporter` SHALL görüntüde pano başlığını, tarih/saat bilgisini ve katılımcı sayısını içermelidir.
3. THE `ImageExporter` SHALL görüntüde yalnızca not içeren sütunları göstermelidir; boş sütunlar dahil edilmemelidir.
4. WHERE `board.showAuthors` ayarı etkinse, THE `ImageExporter` SHALL görüntüde not yazarlarını göstermelidir.
5. WHERE `board.showVoting` ayarı etkinse, THE `ImageExporter` SHALL görüntüde oy sayılarını göstermelidir.
6. THE `ImageExporter` SHALL görüntünün alt kısmında Aksa logosu ve "Kazancı Holding" marka bilgisini içermelidir.

---

### Gereksinim 5: Uluslararasılaştırma (i18n)

**Kullanıcı Hikayesi:** Bir retrospektif kullanıcısı olarak, görüntü export arayüzündeki tüm metinlerin Türkçe olmasını istiyorum; böylece uygulamanın dil tutarlılığı korunur.

#### Kabul Kriterleri

1. THE `ExportBoard` SHALL PNG ve JPG export butonlarının etiketlerini `src/i18n/tr/translation.json` dosyasındaki `ExportBoardOption` anahtarından okumalıdır.
2. THE `ImageExporter` SHALL başarılı indirme sonrasında gösterilen toast mesajını `ExportBoardOption` anahtarından okumalıdır.
3. THE `ImageExporter` SHALL hata durumunda gösterilen toast mesajını `ExportBoardOption` anahtarından okumalıdır.
4. THE `ExportBoard` SHALL yükleme durumundaki buton aria-label değerini `ExportBoardOption` anahtarından okumalıdır.

---

### Gereksinim 6: Export Utility Fonksiyonları

**Kullanıcı Hikayesi:** Bir geliştirici olarak, görüntü export mantığının `utils/export.ts` dosyasında merkezi fonksiyonlar olarak tanımlanmasını istiyorum; böylece kod tekrarı önlenir ve test edilebilirlik artar.

#### Kabul Kriterleri

1. THE `ImageExporter` SHALL `exportAsPNG(element: HTMLElement, name?: string): Promise<void>` imzalı bir fonksiyon aracılığıyla PNG export işlemini gerçekleştirmelidir.
2. THE `ImageExporter` SHALL `exportAsJPG(element: HTMLElement, name?: string): Promise<void>` imzalı bir fonksiyon aracılığıyla JPG export işlemini gerçekleştirmelidir.
3. THE `ImageExporter` SHALL her iki fonksiyonda da dosya adı üretimi için mevcut `fileName(name)` yardımcı fonksiyonunu kullanmalıdır.
4. THE `ImageExporter` SHALL her iki fonksiyonda da dosya indirme işlemi için mevcut `file-saver` kütüphanesini kullanmalıdır.
5. WHEN `exportAsPNG` veya `exportAsJPG` fonksiyonu çağrıldığında, THE `ImageExporter` SHALL `html2canvas` kütüphanesini dinamik import (`import('html2canvas')`) ile yükleyerek başlangıç bundle boyutunu artırmamalıdır.

---

### Gereksinim 7: html2canvas Kütüphanesi Entegrasyonu

**Kullanıcı Hikayesi:** Bir geliştirici olarak, `html2canvas` kütüphanesinin projeye doğru şekilde entegre edilmesini istiyorum; böylece mevcut bağımlılıklarla çakışma yaşanmaz.

#### Kabul Kriterleri

1. THE `ImageExporter` SHALL `html2canvas` kütüphanesini `package.json` bağımlılıklarına ekleyerek kullanmalıdır.
2. THE `ImageExporter` SHALL `html2canvas` için TypeScript tip tanımlarını (`@types/html2canvas` veya kütüphane içi tipler) kullanmalıdır.
3. WHEN `html2canvas` bir DOM öğesini işlerken, THE `ImageExporter` SHALL `useCORS: true` seçeneğini geçerek harici kaynaklı görsellerin (logo, kullanıcı avatarları) doğru render edilmesini sağlamalıdır.
4. WHEN `html2canvas` bir DOM öğesini işlerken, THE `ImageExporter` SHALL `logging: false` seçeneğini geçerek konsol çıktısını bastırmalıdır.
