# Redux Store Rehberi

## İçindekiler

1. [Giriş](#giriş)
2. [Temel Kavramlar](#temel-kavramlar)
   1. [Store](#store)
   2. [Action'lar](#actionlar)
   3. [Reducer'lar](#reducerlar)
   4. [Async Thunk'lar](#async-thunklar)
3. [Aksa'ya Özgü Bilgiler](#aksaya-özgü-bilgiler)

## Giriş

Redux 2.x sürümüne geçişle birlikte tüm store yeniden yapılandırıldı. Yeni geliştiricilerin parçaların nasıl bir araya geldiğini daha kolay anlaması için bu rehber hazırlandı.

### Tanım

Redux, JavaScript uygulamaları için öngörülebilir bir durum yönetim kapsayıcısıdır. Uygulamanın durumunu tek, merkezi bir store'da yönetmeye yardımcı olur.

### Yapı

Store yapısı, her özelliğin kendi alt dizinine sahip olacağı şekilde tanımlanmıştır:

```
store.ts
features/
├── ozellikA/
│   ├── actions.ts
│   ├── reducer.ts
│   ├── thunks.ts
│   └── types.ts
└── ozellikB/
    ├── actions.ts
    ├── reducer.ts
    ├── thunks.ts
    └── types.ts
```

## Temel Kavramlar

### Store

Store, uygulamanın tüm durum ağacını tutar. Mevcut duruma erişim sağlar ve durumu değiştirmek için action'lar dispatch eder.

#### Mevcut Duruma Erişim

```tsx
import {useAppSelector} from "store";

export const OzelBilesen = () => {
  const degerA = useAppSelector((state) => state.ozellikA.degerA);

  return <div>Değer A: {degerA}</div>;
};
```

Değer store'da değiştiğinde otomatik olarak güncellenir ve bileşeni yeniden render eder. Değer değiştirilemez; değiştirmek için bir _Action_ _dispatch_ edilmesi gerekir.

### Action'lar

Action'lar ne olduğunu tanımlayan düz nesnelerdir. Bir `type` ve isteğe bağlı `payload` içerirler:

```ts
import {createAction} from "@reduxjs/toolkit";

export const ornekAction = createAction<T>("ozellikA/actionA");
```

Basit bir action tanımı:

```ts
export const degerAyarla = createAction<number>("ozellikA/degerAyarla");
```

Action'lar dispatch edilebilir:

```ts
import {useAppDispatch} from "store";

const dispatch = useAppDispatch();

dispatch(degerAyarla(42));
```

### Reducer'lar

Reducer'lar, action'lara yanıt olarak durumun nasıl değişeceğini belirtir. `builder` kalıbını kullanıyoruz:

```ts
// types.ts
export type ReducerADurumu = {
  degerA: number;
  diziA: string[];
};
```

```ts
const baslangicDurumu: ReducerADurumu = {degerA: 0, diziA: []};

export const ozellikAReducer = createReducer(baslangicDurumu, (builder) =>
  builder
    .addCase(degerAyarla, (state, action) => {
      state.degerA = action.payload;
    })
    .addCase(eleman_ekle, (state, action) => {
      state.diziA.push(action.payload);
    })
);
```

Redux dahili olarak [Immer](https://immerjs.github.io/immer/) kullandığından reducer içindeki durum yazılabilir bir taslaktır; doğrudan mutasyon yapılabilir.

**Önemli**: Durumu doğrudan yeniden yazmayın!

```ts
builder.addCase(yasadisiYeniden, (state, action) => {
  state = action.payload; // bunu yapmayın
});
```

### Async Thunk'lar

Thunk'lar, asenkron işlemlere izin verir. Action'lar düz nesneler ve reducer'lar saf fonksiyonlar olduğundan, thunk'lar asenkron kod ve yan etkiler için kullanılır:

```ts
export const asenkronThunk = createAsyncThunk<R, T, {state: UygulamaDurumu}>("ozellikA/asenkronGorev", async (payload, {dispatch, getState}) => {
  const sonuc = await API.islemYap(payload);
  dispatch(birAction(sonuc));
});
```

Thunk'lar diğer action'lar gibi çağrılır:

```ts
dispatch(asenkronThunk(parametre));
```

## Aksa'ya Özgü Bilgiler

### `retryable` Fonksiyonu

Bu fonksiyon, thunk'lar için hata yönetimi ve yeniden deneme mantığını soyutlar:

```ts
import {retryable} from "store";

export const asenkronThunk = createAsyncThunk<R, T, {state: UygulamaDurumu}>(
  "ozellikA/asenkronGorev",
  async (payload, {dispatch, getState}) => {
    await retryable(
      () => API.islemYap(payload),
      dispatch,
      () => asenkronThunk(payload),
      "asenkronHata"
    );
  }
);
```

### Socket'ler ve Backend

Aksa Backend, birincil iletişim için socket'ler kullanır. İki socket bağlantısı vardır:

1. **requests/thunks**: İlk giriş için kullanılır; sonrasında kapatılır.
2. **board/thunks**: Katılımcılar, notlar vb. pano değişiklikleri için backend ile iletişimde kullanılır.

Not ekleme akışı örneği:

1. Kullanıcı not eklemek için butona tıklar
2. `addNote` thunk'ı dispatch edilir
3. Thunk backend'i çağırır
4. Backend notu veritabanına ekler
5. Backend socket'e `"NOTE_ADDED"` olayı yayar
6. Frontend `"NOTE_ADDED"` olayını alır
7. `addedNote` action'ı dispatch edilir
8. Reducer action'ı yakalar ve notu `NoteState`'e ekler
9. Durum güncellenir
10. `useAppSelector` ile notları okuyan bileşenler yeniden render edilir
