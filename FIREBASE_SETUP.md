# Firebase Kurulum Rehberi

Bu proje Firebase kullanarak dinamik tag sistemi çalıştırır. Aşağıdaki adımları takip ederek Firebase'i kurun.

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. "Create a project" butonuna tıklayın
3. Proje adı verin (örn: "dynamic-tag-system")
4. Google Analytics'i etkinleştirin (isteğe bağlı)
5. Projeyi oluşturun

## 2. Web Uygulaması Ekleme

1. Firebase Console'da projenizi açın
2. "Project Overview" > "Add app" > Web (</>) ikonuna tıklayın
3. App nickname verin (örn: "tag-system-web")
4. "Register app" butonuna tıklayın
5. Firebase SDK konfigürasyon bilgilerini kopyalayın

## 3. Realtime Database Kurulumu

1. Firebase Console'da "Realtime Database" sekmesine gidin
2. "Create Database" butonuna tıklayın
3. Lokasyon seçin (Europe-west1 önerilen)
4. "Start in test mode" seçin (geliştirme için)
5. "Enable" butonuna tıklayın

### Realtime Database Güvenlik Kuralları

Geliştirme aşamasında test modunda başlayabilirsiniz, ancak production için aşağıdaki kuralları kullanın:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true,
      ".indexOn": "uniqueUrl",
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "test": {
      ".read": true,
      ".write": true
    }
  }
}
```

**⚠️ ÖNEMLİ:** Bu kuralları Firebase Console'da uygulamanız gerekiyor:

1. Firebase Console > Realtime Database > Rules sekmesine gidin
2. Yukarıdaki JSON'u kopyalayın
3. "Publish" butonuna tıklayın

### Database URL'sini Alın

1. Realtime Database sayfasında URL'yi kopyalayın (örn: `https://your-project-default-rtdb.europe-west1.firebasedatabase.app/`)
2. Bu URL'yi environment variables'a ekleyin

## 4. Environment Variables Kurulumu

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.europe-west1.firebasedatabase.app/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your-measurement-id

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Site Base URL
NEXT_PUBLIC_SITE_URL=https://tag.asnus.com
```

## 6. Google reCAPTCHA Kurulumu

1. [Google reCAPTCHA](https://www.google.com/recaptcha/admin/create)'ya gidin
2. "Register a new site" butonuna tıklayın
3. Label verin (örn: "Tag System")
4. reCAPTCHA type: "reCAPTCHA v2" seçin
5. Domain ekleyin (localhost:3000 ve production domain)
6. Site key ve Secret key'i kopyalayın
7. Environment variables'a ekleyin

## 7. Firestore Koleksiyonları

Sistem aşağıdaki koleksiyonları kullanır:

### `users` Koleksiyonu

```javascript
{
  id: string,
  personalInfo: {
    name: string,
    phone: string,
    email: string,
    instagram: string,
    bloodType: string
  },
  motorcycle: {
    brand: string,
    model: string,
    plate: string,
    image: string
  },
  emergency: {
    name: string,
    phone: string
  },
  theme: string,
  tag: string,
  note: string,
  uniqueUrl: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  isPremium: boolean,
  showAds: boolean,
  qrCodeUrl: string,
  isActive: boolean
}
```

## 8. Bağımlılıkları Yükleme

```bash
npm install
```

## 9. Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

## 10. Production Deployment

### Vercel Deployment

1. Vercel hesabınıza giriş yapın
2. GitHub repository'yi bağlayın
3. Environment variables'ları Vercel dashboard'dan ekleyin
4. Deploy edin

### Environment Variables for Production

Production ortamında aşağıdaki environment variables'ları eklemeyi unutmayın:

- Tüm Firebase konfigürasyon değerleri
- reCAPTCHA keys
- NEXT_PUBLIC_SITE_URL (production URL'i)

## Sorun Giderme

### Firebase Connection Errors

1. Environment variables'ların doğru olduğundan emin olun
2. Firebase project'in aktif olduğunu kontrol edin
3. Firestore ve Storage'ın etkinleştirildiğini doğrulayın

### reCAPTCHA Errors

1. Site key'in doğru olduğundan emin olun
2. Domain'in reCAPTCHA console'da ekli olduğunu kontrol edin
3. localhost:3000'in development için ekli olduğunu doğrulayın

### Storage Upload Errors

1. Storage kurallarının doğru olduğundan emin olun
2. Storage bucket'ın aktif olduğunu kontrol edin
3. QR kod upload path'inin doğru olduğunu doğrulayın

## Güvenlik Notları

1. Production'da Firestore kurallarını sıkılaştırın
2. reCAPTCHA secret key'i asla client-side'da expose etmeyin
3. Firebase Admin SDK kullanarak backend işlemlerini güvence altına alın
4. Regular security audit'ler yapın
