export interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  instagram: string;
  bloodType: string;
}

export interface Motorcycle {
  brand: string;
  model: string;
  plate: string;
  image: string;
}

export interface Emergency {
  name: string;
  phone: string;
}

// Tek bir Tag (Tag) interface'i - Firestore için
export interface Tag {
  id: string;
  userId: string; // Tag'in sahibi kullanıcının ID'si (boş ise sahipsiz)
  personalInfo: PersonalInfo;
  motorcycle: Motorcycle;
  emergency: Emergency;
  theme: 'honda' | 'yamaha' | 'kawasaki' | 'suzuki' | 'bmw' | 'ktm' | 'ducati' | 'aprilia' | 'harley' | 'triumph' | 'husqvarna' | 'cfmoto' | 'benelli' | 'moto_guzzi' | 'mv_agusta' | 'indian' | 'royal_enfield' | 'jawa' | 'rks' | 'bajaj' | 'generic';
  tag: string;
  note: string;
  uniqueUrl: string; // Random oluşturulan URL
  createdAt: Date;
  updatedAt: Date;
  qrCodeUrl?: string; // QR kod resim URL'si
  isActive: boolean; // Tag aktif durumu
  name: string; // Tag adı (kullanıcı tarafından belirlenen)
  isClaimed?: boolean; // Tag sahiplenilmiş mi (markasız taglar için)
}

// Kullanıcı interface'i - Firestore için
export interface User {
  id: string;
  authUid: string; // Firebase Auth kullanıcı ID'si - zorunlu alan
  email: string; // Kullanıcı e-postası
  displayName?: string; // Kullanıcı adı
  role: 'admin' | 'user'; // Kullanıcı rolü, varsayılan 'user'
  membership: 'standard' | 'premium'; // Üyelik tipi, varsayılan 'standard'
  showAds: boolean; // Reklam gösterim durumu
  createdAt: Date;
  updatedAt: Date;
  maxTags: number; // Maksimum tag sayısı (standard: 1, premium: sınırsız)
}

// Geriye uyumluluk için isPremium özelliği ile birlikte
export interface UserWithLegacy extends User {
  isPremium: boolean; // Geriye uyumluluk için hesaplanan özellik
  tags?: Tag[]; // İsteğe bağlı, sadece ihtiyaç duyulduğunda yüklenir
}

// Geriye uyumluluk için eski User interface'ini koruyoruz
export interface LegacyUser {
  id: string;
  authUid?: string; // Firebase Auth kullanıcı ID'si - yeni eklenen alan
  personalInfo: PersonalInfo;
  motorcycle: Motorcycle;
  emergency: Emergency;
  theme: 'honda' | 'yamaha' | 'kawasaki' | 'suzuki' | 'bmw' | 'ktm' | 'ducati' | 'aprilia' | 'harley' | 'triumph' | 'husqvarna' | 'cfmoto' | 'benelli' | 'moto_guzzi' | 'mv_agusta' | 'indian' | 'royal_enfield' | 'jawa' | 'rks' | 'bajaj';
  tag: string;
  note: string;
  // Yeni alanlar (opsiyonel - geriye uyumluluk için)
  uniqueUrl?: string; // Random oluşturulan URL
  createdAt?: Date;
  updatedAt?: Date;
  isPremium?: boolean; // Premium üyelik durumu
  showAds?: boolean; // Reklam gösterim durumu
  qrCodeUrl?: string; // QR kod resim URL'si
  isActive?: boolean; // Tag aktif durumu
}

export interface UsersData {
  [key: string]: User;
}
