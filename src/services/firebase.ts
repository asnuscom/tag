import { 
  ref, 
  push, 
  set, 
  get, 
  update,
  serverTimestamp
} from 'firebase/database';
import { nanoid } from 'nanoid';
import { database } from '@/config/firebase';
import { User } from '@/types/user';

// Benzersiz URL oluşturma (basit yaklaşım - query kullanmaz)
export const generateUniqueUrl = (): string => {
  // Timestamp + random string ile benzersizlik garantisi
  const timestamp = Date.now().toString(36); // 36'lık sayı sistemi
  const randomStr = nanoid(4); // 4 karakter random
  return `${timestamp}${randomStr}`.toLowerCase();
};

// Yeni kullanıcı oluşturma
export const createUser = async (userData: Omit<User, 'id' | 'uniqueUrl' | 'createdAt' | 'updatedAt' | 'qrCodeUrl' | 'isActive'> & {isPremium: boolean, showAds: boolean}): Promise<{id: string, uniqueUrl: string, qrCodeUrl: string}> => {
  try {
    // Benzersiz URL oluştur
    const uniqueUrl = generateUniqueUrl();
    
    // QR kod URL'si (client-side'da oluşturulacak)
    const qrCodeUrl = `data:qr-${uniqueUrl}`; // Geçici placeholder
    
    // Kullanıcı verilerini hazırla
    const newUser = {
      ...userData,
      uniqueUrl,
      qrCodeUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };
    
    // Realtime Database'e kaydet
    const usersRef = ref(database, 'users');
    const newUserRef = push(usersRef);
    await set(newUserRef, newUser);
    
    return {
      id: newUserRef.key!,
      uniqueUrl,
      qrCodeUrl
    };
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    throw error;
  }
};

// Kullanıcıyı benzersiz URL ile getirme (tüm kullanıcıları tarayarak)
export const getUserByUniqueUrl = async (uniqueUrl: string): Promise<User | null> => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    // Tüm kullanıcıları tara ve uniqueUrl eşleşenini bul
    const users = snapshot.val();
    for (const [userId, userData] of Object.entries(users)) {
      const user = userData as any;
      if (user.uniqueUrl === uniqueUrl) {
        return {
          id: userId,
          ...user,
          // Timestamp'leri Date'e çevir
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
        } as User;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    throw error;
  }
};

// Kullanıcı güncelleme
export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    throw error;
  }
};

// Premium durumu güncelleme
export const updatePremiumStatus = async (userId: string, isPremium: boolean): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      isPremium,
      showAds: !isPremium, // Premium kullanıcılar reklam görmez
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Premium durumu güncelleme hatası:', error);
    throw error;
  }
};

// Tag aktiflik durumu güncelleme
export const updateTagStatus = async (userId: string, isActive: boolean): Promise<void> => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Tag durumu güncelleme hatası:', error);
    throw error;
  }
};
