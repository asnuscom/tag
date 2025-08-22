# Dynamic Tag System

Motosiklet sürücüleri için dinamik iletişim kartları sistemi. JSON dosyasından veri alarak otomatik olarak kişiselleştirilmiş sayfalar oluşturur.

## Özellikler

- ✅ **Dinamik Routing**: `/username` formatında otomatik sayfa oluşturma
- ✅ **Marka Temları**: Husqvarna, Honda, Yamaha, Triumph için özel temalar
- ✅ **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- ✅ **TypeScript**: Tip güvenli geliştirme
- ✅ **Tailwind CSS**: Modern ve hızlı styling
- ✅ **GitHub Actions**: Otomatik deployment
- ✅ **Static Export**: GitHub Pages uyumlu

## Kullanılan Teknolojiler

- **Next.js 15**: App Router ile
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Styling framework
- **GitHub Actions**: CI/CD pipeline

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## Proje Yapısı

```
src/
├── app/
│   ├── [username]/          # Dinamik routing
│   │   └── page.tsx
│   ├── page.tsx             # Ana sayfa
│   └── not-found.tsx        # 404 sayfası
├── components/
│   └── TagCard.tsx          # Ana kart komponenti
├── config/
│   └── themes.ts            # Marka temaları
├── data/
│   └── users.json           # Kullanıcı verileri
└── types/
    └── user.ts              # TypeScript tipleri
```

## Yeni Kullanıcı Ekleme

`src/data/users.json` dosyasına yeni kullanıcı ekleyin:

```json
{
  "username": {
    "id": "username",
    "personalInfo": {
      "name": "İsim Soyisim",
      "phone": "05xxxxxxxxx",
      "email": "email@domain.com",
      "instagram": "instagram_username",
      "bloodType": "A RH +"
    },
    "motorcycle": {
      "brand": "Marka",
      "model": "Model",
      "plate": "XX ABC 123",
      "image": "/assets/motorcycles/image.png"
    },
    "emergency": {
      "name": "Acil Kişi",
      "phone": "05xxxxxxxxx"
    },
    "theme": "husqvarna|honda|yamaha|triumph",
    "note": "Özel not mesajı"
  }
}
```

## Deployment

GitHub Actions otomatik olarak `main` branch'e push edildiğinde deploy eder.

### Manuel Deploy

```bash
npm run build
```

## URL Yapısı

- Ana sayfa: `https://yourdomain.com/`
- Kullanıcı kartları: `https://yourdomain.com/username`

## Örnek URL'ler

- `https://tag.asnus.com/svartrider` - Husqvarna Svartpilen
- `https://tag.asnus.com/casska` - Honda CB250R
- `https://tag.asnus.com/bluerider` - Yamaha R25
- `https://tag.asnus.com/british` - Triumph Street Triple

## Tema Sistemı

Her marka için özel renk paleti ve tasarım:

- **Husqvarna**: Sarı/Siyah (İskandinav minimalizm)
- **Honda**: Kırmızı/Siyah (Japon güvenilirlik)
- **Yamaha**: Mavi/Siyah (Japon performans)
- **Triumph**: Yeşil/Altın (İngiliz zarafet)

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- **E-posta**: info@asnus.com
- **WhatsApp**: +90 542 106 52 99
- **Website**: https://asnus.com
