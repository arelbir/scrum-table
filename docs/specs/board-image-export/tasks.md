# Uygulama Planı: Board Image Export

## Genel Bakış

Bu plan, `html2canvas` kullanarak pano görüntüsünü PNG ve JPG formatlarında dışa aktarma özelliğini adım adım hayata geçirir. Her görev bir öncekinin üzerine inşa edilir; son adımda tüm parçalar birbirine bağlanır.

## Görevler

- [x] 1. `html2canvas` bağımlılığını ekle ve `utils/export.ts` dosyasına export fonksiyonlarını yaz
  - `package.json` dosyasına `"html2canvas": "^1.4.1"` bağımlılığını ekle
  - `utils/export.ts` dosyasına `ExportFormat` tipini ekle
  - `exportAsPNG(element: HTMLElement, name?: string): Promise<void>` fonksiyonunu yaz; `html2canvas`'ı dinamik import ile yükle, `scale: 2, useCORS: true, logging: false` seçeneklerini kullan, `saveAs` ile `.png` uzantılı dosya indir
  - `exportAsJPG(element: HTMLElement, name?: string): Promise<void>` fonksiyonunu yaz; aynı seçeneklerle `html2canvas` çağır, `toBlob`'u `image/jpeg` MIME türü ve `0.92` kalite değeriyle çağır, `saveAs` ile `.jpg` uzantılı dosya indir
  - Her iki fonksiyonda da dosya adı için mevcut `fileName(name)` yardımcı fonksiyonunu kullan
  - _Gereksinimler: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 1.1 `fileName` fonksiyonu için property testi yaz
    - **Özellik 1: fileName fonksiyonu tarih öneki üretir**
    - **Doğrular: Gereksinim 1.3, 2.3, 6.3**
    - `fast-check` ile `fc.string()` üzerinde `fileName(name)` çıktısının `/^\d{4}-\d{2}-\d{2}_/` regex'iyle eşleştiğini doğrula; 100 iterasyon

  - [ ]* 1.2 `exportAsPNG` ve `exportAsJPG` için dosya uzantısı property testleri yaz
    - **Özellik 2: PNG export dosya uzantısı**
    - **Özellik 3: JPG export dosya uzantısı**
    - **Doğrular: Gereksinim 1.3, 2.3, 6.1, 6.2, 6.4**
    - `html2canvas` ve `saveAs`'ı mock'la; `fc.string({ minLength: 1 })` ile rastgele isimler üret; `saveAs`'ın sırasıyla `.png` ve `.jpg` uzantılı dosya adıyla çağrıldığını doğrula; 100 iterasyon

  - [ ]* 1.3 `html2canvas` seçenekleri için property testleri yaz
    - **Özellik 4: html2canvas seçenekleri — PNG**
    - **Özellik 5: html2canvas seçenekleri — JPG**
    - **Doğrular: Gereksinim 1.4, 2.4, 7.3, 7.4**
    - `fc.constantFrom("png", "jpg")` ile format seç; `html2canvas` mock'unun `{ scale: 2, useCORS: true, logging: false }` içeren seçeneklerle çağrıldığını doğrula; JPG için `toBlob`'un `image/jpeg` ve `0.92` ile çağrıldığını doğrula; 100 iterasyon

  - [ ]* 1.4 Hata durumu için property testi yaz
    - **Özellik 7: Hata durumunda toast bildirimi**
    - **Doğrular: Gereksinim 1.5, 2.5**
    - `fc.string()` ile rastgele hata mesajları üret; `html2canvas` mock'unu `mockRejectedValueOnce` ile reddet; `Toast.error`'ın çağrıldığını doğrula; 100 iterasyon

- [x] 2. i18n çeviri key'lerini ekle
  - `src/i18n/tr/translation.json` dosyasındaki `ExportBoardOption` anahtarına şu key'leri ekle:
    - `"exportAsPNG": "PNG olarak dışa aktar"`
    - `"exportAsJPG": "JPG olarak dışa aktar"`
    - `"exportImageSuccess": "Görüntü başarıyla indirildi!"`
    - `"exportImageError": "Görüntü oluşturulurken hata oluştu. Lütfen tekrar deneyin."`
    - `"exportingAriaLabel": "Görüntü oluşturuluyor..."`
  - _Gereksinimler: 5.1, 5.2, 5.3, 5.4_

- [x] 3. `ExportBoard.tsx` bileşenine PNG/JPG butonlarını ve gizli PrintView container'ını ekle
  - `useState<boolean>(false)` ile `isExporting` state'i ekle
  - `useRef<HTMLDivElement>(null)` ile `printViewRef` referansı oluştur
  - Bileşenin render çıktısına `position: absolute; left: -9999px; top: -9999px` stilinde gizli bir `div` ekle; içine `PrintView` bileşenini render et ve `ref={printViewRef}` ata
  - `SettingsButton` ile PNG butonu ekle: `label={t("ExportBoardOption.exportAsPNG")}`, `icon={AddImage}`, `disabled={isExporting}`, `data-testid="export-png"`, `reverseOrder`
  - `SettingsButton` ile JPG butonu ekle: `label={t("ExportBoardOption.exportAsJPG")}`, `icon={AddImage}`, `disabled={isExporting}`, `data-testid="export-jpg"`, `reverseOrder`
  - PNG butonunun `onClick` handler'ında: `isExporting = true` yap, `exportAsPNG(printViewRef.current, boardName)` çağır, başarıda `Toast.success(t("ExportBoardOption.exportImageSuccess"))` göster, hata durumunda `Toast.error(t("ExportBoardOption.exportImageError"))` göster, `finally` bloğunda `isExporting = false` yap
  - JPG butonu için aynı akışı `exportAsJPG` ile uygula
  - Yükleme sırasında butonların `aria-label`'ını `t("ExportBoardOption.exportingAriaLabel")` olarak güncelle
  - _Gereksinimler: 1.1, 1.2, 1.5, 2.1, 2.2, 2.5, 3.1, 3.2, 3.3, 4.1, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 3.1 Export sırasında buton durumu için property testi yaz
    - **Özellik 6: Export sırasında butonlar devre dışı**
    - **Doğrular: Gereksinim 3.1, 3.2, 3.3**
    - `fc.constantFrom("png", "jpg")` ile format seç; butona tıklandıktan sonra `disabled` olduğunu, export tamamlandıktan sonra `disabled` olmadığını `waitFor` ile doğrula; 100 iterasyon

  - [ ]* 3.2 `ExportBoard` bileşeni için birim testleri yaz
    - PNG ve JPG butonlarının render edildiğini doğrula
    - Export başladığında her iki butonun da `disabled` olduğunu doğrula
    - Başarılı export sonrasında `Toast.success`'in çağrıldığını doğrula
    - `html2canvas` hata fırlattığında `Toast.error`'ın çağrıldığını doğrula
    - _Gereksinimler: 1.1, 1.5, 2.1, 2.5, 3.1, 3.2, 3.3_

- [x] 4. Kontrol noktası — Tüm testlerin geçtiğinden emin ol
  - Tüm testlerin geçtiğinden emin ol, sorular varsa kullanıcıya sor.

## Notlar

- `*` ile işaretli görevler isteğe bağlıdır; MVP için atlanabilir
- Her görev izlenebilirlik için ilgili gereksinimlere referans verir
- `SettingsButton` bileşeni zaten `disabled` prop'unu desteklemektedir; ek değişiklik gerekmez
- `fast-check` paketi `devDependencies`'e eklenmelidir: `"fast-check": "^3.x.x"`
- `html2canvas` dinamik import ile yüklendiğinden başlangıç bundle boyutu artmaz
