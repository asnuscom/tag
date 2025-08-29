import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { User, UserWithLegacy } from '@/types/user';

// Collections
const USERS_COLLECTION = 'users';

// Kullanıcı oluşturma
export const createUser = async (
  authUid: string, 
  email: string, 
  displayName?: string,
  role: 'admin' | 'user' = 'user'
): Promise<User> => {
  try {
    const userData = {
      authUid,
      email,
      displayName,
      role,
      membership: 'standard' as 'standard' | 'premium',
      showAds: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      maxTags: 1 // Standard kullanıcılar sadece 1 tag oluşturabilir
    };
    
    const usersCollection = collection(firestore, USERS_COLLECTION);
    const docRef = await addDoc(usersCollection, userData);
    
    return {
      id: docRef.id,
      authUid,
      email,
      displayName,
      role,
      membership: 'standard',
      showAds: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      maxTags: 1
    };
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    throw new Error('Kullanıcı oluşturulamadı');
  }
};

// AuthUid ile kullanıcı bulma
export const getUserByAuthUid = async (authUid: string): Promise<User | null> => {
  try {
    const usersCollection = collection(firestore, USERS_COLLECTION);
    const q = query(usersCollection, where('authUid', '==', authUid), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      authUid: data.authUid,
      email: data.email,
      displayName: data.displayName,
      role: data.role || 'user',
      membership: data.membership || 'standard',
      showAds: data.showAds !== false, // Varsayılan true
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      maxTags: data.maxTags || (data.membership === 'premium' ? 999 : 1)
    };
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    throw new Error('Kullanıcı bilgileri getirilemedi');
  }
};

// ID ile kullanıcı bulma
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      return null;
    }
    
    const data = userSnapshot.data();
    
    return {
      id: userSnapshot.id,
      authUid: data.authUid,
      email: data.email,
      displayName: data.displayName,
      role: data.role || 'user',
      membership: data.membership || 'standard',
      showAds: data.showAds !== false,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      maxTags: data.maxTags || (data.membership === 'premium' ? 999 : 1)
    };
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    throw new Error('Kullanıcı bilgileri getirilemedi');
  }
};

// Tüm kullanıcıları getirme (Admin için)
export const getAllUsers = async (): Promise<UserWithLegacy[]> => {
  try {
    const usersCollection = collection(firestore, USERS_COLLECTION);
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users: UserWithLegacy[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const user: UserWithLegacy = {
        id: doc.id,
        authUid: data.authUid,
        email: data.email,
        displayName: data.displayName,
        role: data.role || 'user',
        membership: data.membership || 'standard',
        showAds: data.showAds !== false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        maxTags: data.maxTags || (data.membership === 'premium' ? 999 : 1),
        // Geriye uyumluluk için
        isPremium: data.membership === 'premium',
        tags: [] // Boş array, gerektiğinde doldurulacak
      };
      users.push(user);
    });
    
    return users;
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    throw new Error('Kullanıcı listesi getirilemedi');
  }
};

// Tag'leri ile birlikte tüm kullanıcıları getirme (Admin için)
export const getAllUsersWithTags = async (): Promise<UserWithLegacy[]> => {
  try {
    const { getUserTags } = await import('@/services/tagService');
    
    const usersCollection = collection(firestore, USERS_COLLECTION);
    const q = query(usersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users: UserWithLegacy[] = [];
    
    // Her kullanıcı için tag'leri de yükle
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      
      // Kullanıcının tag'lerini yükle
      let userTags = [];
      try {
        userTags = await getUserTags(doc.id);
      } catch (error) {
        console.warn(`Kullanıcı ${doc.id} için tag'ler yüklenemedi:`, error);
      }
      
      const user: UserWithLegacy = {
        id: doc.id,
        authUid: data.authUid,
        email: data.email,
        displayName: data.displayName,
        role: data.role || 'user',
        membership: data.membership || 'standard',
        showAds: data.showAds !== false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        maxTags: data.maxTags || (data.membership === 'premium' ? 999 : 1),
        // Geriye uyumluluk için
        isPremium: data.membership === 'premium',
        tags: userTags
      };
      
      users.push(user);
    }
    
    return users;
  } catch (error) {
    console.error('Tag\'li kullanıcılar getirme hatası:', error);
    throw new Error('Kullanıcılar ve tag\'ler getirilemedi');
  }
};

// Kullanıcı güncelleme
export const updateUser = async (
  userId: string, 
  updates: Partial<Omit<User, 'id' | 'authUid' | 'createdAt'>>
): Promise<void> => {
  try {
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    // maxTags'ı membership'e göre ayarla
    if (updates.membership) {
      updateData.maxTags = updates.membership === 'premium' ? 999 : 1;
    }
    
    await updateDoc(userDoc, updateData);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    throw new Error('Kullanıcı bilgileri güncellenemedi');
  }
};

// Premium üyelik durumu güncelleme
export const updateMembershipStatus = async (
  userId: string, 
  membership: 'standard' | 'premium'
): Promise<void> => {
  try {
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    
    await updateDoc(userDoc, {
      membership,
      maxTags: membership === 'premium' ? 999 : 1,
      showAds: membership !== 'premium', // Premium kullanıcılarda reklam yok
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Üyelik durumu güncelleme hatası:', error);
    throw new Error('Üyelik durumu güncellenemedi');
  }
};

// Kullanıcı rolü güncelleme (Admin işlemi)
export const updateUserRole = async (
  userId: string, 
  role: 'admin' | 'user'
): Promise<void> => {
  try {
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    
    await updateDoc(userDoc, {
      role,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Kullanıcı rolü güncelleme hatası:', error);
    throw new Error('Kullanıcı rolü güncellenemedi');
  }
};

// Kullanıcı silme
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    throw new Error('Kullanıcı silinemedi');
  }
};

// Kullanıcının kaç tag oluşturabileceğini kontrol etme
export const canUserCreateTag = async (userId: string): Promise<{
  canCreate: boolean;
  reason?: string;
  currentCount: number;
  maxTags: number;
}> => {
  try {
    const user = await getUserById(userId);
    
    if (!user) {
      return {
        canCreate: false,
        reason: 'Kullanıcı bulunamadı',
        currentCount: 0,
        maxTags: 1
      };
    }
    
    // Premium kullanıcılar sınırsız tag oluşturabilir
    if (user.membership === 'premium') {
      return {
        canCreate: true,
        reason: undefined,
        currentCount: 0,
        maxTags: 999
      };
    }
    
    // Tag sayısını tagService'den al
    const { getUserTagCount } = await import('./tagService');
    const currentTagCount = await getUserTagCount(userId);
    
    const canCreate = currentTagCount < user.maxTags;
    const reason = !canCreate ? 
      'Standard üyelik ile sadece 1 tag oluşturabilirsiniz. Premium üyelik için iletişime geçin.' : 
      undefined;
    
    return {
      canCreate,
      reason,
      currentCount: currentTagCount,
      maxTags: user.maxTags
    };
  } catch (error) {
    console.error('Tag oluşturma kontrolü hatası:', error);
    return {
      canCreate: false,
      reason: 'Kontrol yapılamadı',
      currentCount: 0,
      maxTags: 1
    };
  }
};

// Email ile kullanıcı arama (Unique email kontrolü için)
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const usersCollection = collection(firestore, USERS_COLLECTION);
    const q = query(usersCollection, where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      authUid: data.authUid,
      email: data.email,
      displayName: data.displayName,
      role: data.role || 'user',
      membership: data.membership || 'standard',
      showAds: data.showAds !== false,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      maxTags: data.maxTags || (data.membership === 'premium' ? 999 : 1)
    };
  } catch (error) {
    console.error('Email ile kullanıcı arama hatası:', error);
    throw new Error('Kullanıcı bulunamadı');
  }
};

// Admin kullanıcılarını getirme
export const getAdminUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(firestore, USERS_COLLECTION);
    const q = query(usersCollection, where('role', '==', 'admin'));
    const querySnapshot = await getDocs(q);
    
    const admins: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const user: User = {
        id: doc.id,
        authUid: data.authUid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        membership: data.membership || 'standard',
        showAds: data.showAds !== false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        maxTags: data.maxTags || (data.membership === 'premium' ? 999 : 1)
      };
      admins.push(user);
    });
    
    return admins;
  } catch (error) {
    console.error('Admin kullanıcıları getirme hatası:', error);
    throw new Error('Admin kullanıcı listesi getirilemedi');
  }
};