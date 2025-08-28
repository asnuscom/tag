import { getUserByAuthUid, updateUserRole } from '@/services/userService';

// Bu fonksiyonu browser console'da çalıştırabilirsiniz
export const makeUserAdmin = async (authUid: string) => {
  try {
    console.log(`Kullanıcı admin yapılıyor: ${authUid}`);
    
    // Kullanıcıyı bul
    const user = await getUserByAuthUid(authUid);
    
    if (!user) {
      console.error('Kullanıcı bulunamadı');
      return;
    }
    
    console.log('Mevcut kullanıcı:', user);
    
    // Admin yap
    await updateUserRole(user.id, 'admin');
    
    console.log('Kullanıcı başarıyla admin yapıldı!');
    
    // Güncellenmiş kullanıcıyı kontrol et
    const updatedUser = await getUserByAuthUid(authUid);
    console.log('Güncellenmiş kullanıcı:', updatedUser);
    
  } catch (error) {
    console.error('Admin yapma hatası:', error);
  }
};

// Global window objesine ekle (development için)
if (typeof window !== 'undefined') {
  (window as any).makeUserAdmin = makeUserAdmin;
}