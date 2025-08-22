# Deployment Rehberi

Bu proje dinamik Firebase Realtime Database kullandığı için **Server-Side Rendering (SSR)** gerektirir.

## 🚀 Deployment Seçenekleri

### 1. Vercel (Önerilen)

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Deploy
vercel

# Environment variables ekle
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
vercel env add NEXT_PUBLIC_RECAPTCHA_SITE_KEY
vercel env add RECAPTCHA_SECRET_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Tekrar deploy
vercel --prod
```

### 2. Netlify

```bash
# Build command
npm run build

# Environment variables Netlify dashboard'dan ekleyin
```

### 3. Railway

```bash
# railway.json oluşturun
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## ⚙️ Konfigürasyon Değişiklikleri

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  // output: "export", // KALDIRILDI - Dynamic content için
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

### [username]/page.tsx

```typescript
// Dynamic routing aktif
export const dynamicParams = true;

export async function generateStaticParams() {
  // Sadece demo kullanıcıları static
  // Dynamic kullanıcılar runtime'da handle edilir
  const demoUsers = demoUsersData as Record<string, User>;
  const staticUsers = usersData as Record<string, User>;
  const allStaticUsers = { ...staticUsers, ...demoUsers };

  return Object.keys(allStaticUsers).map((username) => ({
    username,
  }));
}
```

## 🔧 Environment Variables

Production'da şu environment variables'ları ayarlamanız gerekir:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.europe-west1.firebasedatabase.app/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your-measurement-id

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🎯 Build Test

Local'de production build'i test edin:

```bash
# Build
npm run build

# Start
npm start

# Test
curl http://localhost:3000/
curl http://localhost:3000/demo-honda
curl http://localhost:3000/test-firebase
```

## 🔍 Sorun Giderme

### Build Hatası: "output: export"

```
Error: Page "/[username]/page" is missing param
```

**Çözüm:** `next.config.ts`'den `output: "export"`'u kaldırın.

### Dynamic Route 404

```
404 - This page could not be found
```

**Çözüm:** `dynamicParams = true` ekleyin.

### Firebase Bağlantı Hatası

```
Firebase: Error (auth/invalid-api-key)
```

**Çözüm:** Environment variables'ları kontrol edin.

## 📊 Performance

- **SSR**: Server-side rendering aktif
- **Dynamic**: Runtime'da Firebase'den data çekme
- **Caching**: Firebase data cache'lenir
- **QR Codes**: Client-side oluşturma (hızlı)

## 🔒 Güvenlik

Production'da Firebase rules'ları sıkılaştırın:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": false, // Sadece backend'den yazım
      ".indexOn": "uniqueUrl"
    }
  }
}
```

Admin SDK ile backend API endpoint'leri ekleyin.

## 🚀 Go Live Checklist

- [ ] Firebase project oluşturuldu
- [ ] Realtime Database aktif
- [ ] Database rules ayarlandı
- [ ] Environment variables eklendi
- [ ] reCAPTCHA konfigüre edildi
- [ ] Domain Firebase'e eklendi
- [ ] SSL sertifikası aktif
- [ ] Analytics konfigüre edildi
