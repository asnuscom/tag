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
import { nanoid } from 'nanoid';
import { firestore } from '@/config/firebase';
import { Tag, PersonalInfo, Motorcycle, Emergency } from '@/types/user';

// Collections
const TAGS_COLLECTION = 'tags';

// Benzersiz URL oluşturma
export const generateUniqueUrl = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = nanoid(4);
  return `${timestamp}${randomStr}`.toLowerCase();
};

// Tag oluşturma
export const createTag = async (
  userId: string,
  tagData: {
    name: string;
    personalInfo: PersonalInfo;
    motorcycle: Motorcycle;
    emergency: Emergency;
    theme: Tag['theme'];
    note: string;
  }
): Promise<Tag> => {
  try {
    // Benzersiz URL oluştur
    let uniqueUrl = generateUniqueUrl();
    
    // URL'nin benzersiz olduğunu kontrol et (basit kontrol)
    let urlExists = true;
    let attempts = 0;
    while (urlExists && attempts < 5) {
      const existingTag = await getTagByUrl(uniqueUrl);
      if (!existingTag) {
        urlExists = false;
      } else {
        uniqueUrl = generateUniqueUrl();
        attempts++;
      }
    }

    const newTagData = {
      userId,
      name: tagData.name,
      personalInfo: tagData.personalInfo,
      motorcycle: tagData.motorcycle,
      emergency: tagData.emergency,
      theme: tagData.theme,
      tag: '', // Eski alan, geriye uyumluluk için
      note: tagData.note,
      uniqueUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };
    
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const docRef = await addDoc(tagsCollection, newTagData);
    
    return {
      id: docRef.id,
      userId,
      name: tagData.name,
      personalInfo: tagData.personalInfo,
      motorcycle: tagData.motorcycle,
      emergency: tagData.emergency,
      theme: tagData.theme,
      tag: '',
      note: tagData.note,
      uniqueUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
  } catch (error) {
    console.error('Tag oluşturma hatası:', error);
    throw new Error('Tag oluşturulamadı');
  }
};

// Kullanıcının tag'lerini getirme
export const getUserTags = async (userId: string): Promise<Tag[]> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(
      tagsCollection, 
      where('userId', '==', userId), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const tags: Tag[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const tag: Tag = {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        personalInfo: data.personalInfo,
        motorcycle: data.motorcycle,
        emergency: data.emergency,
        theme: data.theme,
        tag: data.tag || '',
        note: data.note,
        uniqueUrl: data.uniqueUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive !== false // Varsayılan true
      };
      tags.push(tag);
    });
    
    return tags;
  } catch (error) {
    console.error('Kullanıcı tag\'leri getirme hatası:', error);
    throw new Error('Tag\'ler getirilemedi');
  }
};

// Tag ID ile tag getirme
export const getTagById = async (tagId: string): Promise<Tag | null> => {
  try {
    const tagDoc = doc(firestore, TAGS_COLLECTION, tagId);
    const tagSnapshot = await getDoc(tagDoc);
    
    if (!tagSnapshot.exists()) {
      return null;
    }
    
    const data = tagSnapshot.data();
    
    return {
      id: tagSnapshot.id,
      userId: data.userId,
      name: data.name,
      personalInfo: data.personalInfo,
      motorcycle: data.motorcycle,
      emergency: data.emergency,
      theme: data.theme,
      tag: data.tag || '',
      note: data.note,
      uniqueUrl: data.uniqueUrl,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      qrCodeUrl: data.qrCodeUrl,
      isActive: data.isActive !== false
    };
  } catch (error) {
    console.error('Tag getirme hatası:', error);
    throw new Error('Tag bilgileri getirilemedi');
  }
};

// Unique URL ile tag getirme (public endpoint için)
export const getTagByUrl = async (uniqueUrl: string): Promise<Tag | null> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(tagsCollection, where('uniqueUrl', '==', uniqueUrl), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      userId: data.userId,
      name: data.name,
      personalInfo: data.personalInfo,
      motorcycle: data.motorcycle,
      emergency: data.emergency,
      theme: data.theme,
      tag: data.tag || '',
      note: data.note,
      uniqueUrl: data.uniqueUrl,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      qrCodeUrl: data.qrCodeUrl,
      isActive: data.isActive !== false
    };
  } catch (error) {
    console.error('URL ile tag getirme hatası:', error);
    throw new Error('Tag bulunamadı');
  }
};

// Tüm tag'leri getirme (Admin için)
export const getAllTags = async (): Promise<Tag[]> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(tagsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const tags: Tag[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const tag: Tag = {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        personalInfo: data.personalInfo,
        motorcycle: data.motorcycle,
        emergency: data.emergency,
        theme: data.theme,
        tag: data.tag || '',
        note: data.note,
        uniqueUrl: data.uniqueUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive !== false
      };
      tags.push(tag);
    });
    
    return tags;
  } catch (error) {
    console.error('Tüm tag\'leri getirme hatası:', error);
    throw new Error('Tag listesi getirilemedi');
  }
};

// Tag güncelleme
export const updateTag = async (
  tagId: string,
  updates: Partial<Omit<Tag, 'id' | 'userId' | 'uniqueUrl' | 'createdAt'>>
): Promise<void> => {
  try {
    const tagDoc = doc(firestore, TAGS_COLLECTION, tagId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(tagDoc, updateData);
  } catch (error) {
    console.error('Tag güncelleme hatası:', error);
    throw new Error('Tag güncellenemedi');
  }
};

// Tag durumu güncelleme (aktif/pasif)
export const updateTagStatus = async (
  tagId: string,
  isActive: boolean
): Promise<void> => {
  try {
    const tagDoc = doc(firestore, TAGS_COLLECTION, tagId);
    
    await updateDoc(tagDoc, {
      isActive,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Tag durumu güncelleme hatası:', error);
    throw new Error('Tag durumu güncellenemedi');
  }
};

// Tag silme
export const deleteTag = async (tagId: string): Promise<void> => {
  try {
    const tagDoc = doc(firestore, TAGS_COLLECTION, tagId);
    await deleteDoc(tagDoc);
  } catch (error) {
    console.error('Tag silme hatası:', error);
    throw new Error('Tag silinemedi');
  }
};

// Kullanıcının aktif tag sayısını getirme
export const getUserActiveTagCount = async (userId: string): Promise<number> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(
      tagsCollection, 
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Aktif tag sayısı getirme hatası:', error);
    return 0;
  }
};

// Kullanıcının toplam tag sayısını getirme
export const getUserTagCount = async (userId: string): Promise<number> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(tagsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Tag sayısı getirme hatası:', error);
    return 0;
  }
};

// Marka bazında tag sayısını getirme (istatistik için)
export const getTagCountByBrand = async (): Promise<Record<string, number>> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const querySnapshot = await getDocs(tagsCollection);
    
    const brandCounts: Record<string, number> = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const brand = data.motorcycle?.brand;
      if (brand) {
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      }
    });
    
    return brandCounts;
  } catch (error) {
    console.error('Marka bazında tag sayısı getirme hatası:', error);
    return {};
  }
};

// Aktif tag'leri getirme
export const getActiveTags = async (): Promise<Tag[]> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(
      tagsCollection, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const tags: Tag[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const tag: Tag = {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        personalInfo: data.personalInfo,
        motorcycle: data.motorcycle,
        emergency: data.emergency,
        theme: data.theme,
        tag: data.tag || '',
        note: data.note,
        uniqueUrl: data.uniqueUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive !== false
      };
      tags.push(tag);
    });
    
    return tags;
  } catch (error) {
    console.error('Aktif tag\'leri getirme hatası:', error);
    throw new Error('Aktif tag listesi getirilemedi');
  }
};

// QR kod URL'sini güncelleme
export const updateTagQRCode = async (
  tagId: string,
  qrCodeUrl: string
): Promise<void> => {
  try {
    const tagDoc = doc(firestore, TAGS_COLLECTION, tagId);
    
    await updateDoc(tagDoc, {
      qrCodeUrl,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('QR kod URL güncelleme hatası:', error);
    throw new Error('QR kod URL\'si güncellenemedi');
  }
};

// Kullanıcının tüm tag'lerini silme (kullanıcı silindiğinde)
export const deleteAllUserTags = async (userId: string): Promise<void> => {
  try {
    const tagsCollection = collection(firestore, TAGS_COLLECTION);
    const q = query(tagsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Kullanıcının tüm tag\'lerini silme hatası:', error);
    throw new Error('Kullanıcının tag\'leri silinemedi');
  }
};