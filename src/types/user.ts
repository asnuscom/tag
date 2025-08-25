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

export interface User {
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
