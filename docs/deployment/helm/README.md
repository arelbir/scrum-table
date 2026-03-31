# Kubernetes Dağıtımı

## Helm Chart

### Geliştirme Gereksinimleri

- [helm](https://helm.sh)
- [readme generator](https://github.com/bitnami/readme-generator-for-helm)
- [helm unittests](https://github.com/helm-unittest/helm-unittest)
- [tilt](https://tilt.dev/) (isteğe bağlı)
- kubernetes cluster (isteğe bağlı)
- make (isteğe bağlı)

### Geliştirme

En yaygın komutlar için [Makefile](./aksa/Makefile) sağlanmaktadır:

- `make render`: Helm chart'ı `.render` klasörüne render eder
- `make clean`: `.render` klasörünü siler
- `make debug`: Helm chart'ı debug eder
- `make lint`: Helm chart için linting çalıştırır
- `make readme`: Values dosyası için README oluşturur
- `make tilt-up`: Aksa'yı test cluster'ına dağıtmak için tilt başlatır
- `make tilt-down`: Tilt dağıtımını temizler
- `make test`: Helm unit testlerini çalıştırır

#### Unit Testler

[helm unittests](https://github.com/helm-unittest/helm-unittest) kurulduktan sonra:

```bash
make test
```

veya

```bash
helm unittest --file 'tests/**/*.yaml' ../aksa
```

#### Tilt

Helm chart geliştirmesi için bir [Tiltfile](./tilt/Tiltfile) sağlanmaktadır. Tiltfile; namespace, postgresql veritabanı, nats ve Aksa helm chart'ından oluşan minimal bir dağıtım yapar.

*Not*: Aksa helm chart'ı için özel anahtar sağlamanız gerekir.

*Not*: Tilt'i başlatmadan önce test etmek istediğiniz cluster için doğru kube config'i ayarlayın.

```bash
cd tilt
tilt up
```
