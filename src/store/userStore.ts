import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/user';
import { getUserByAuthUid, createUser } from '@/services/userService';

interface UserState {
  // Firebase Auth kullanıcısı
  authUser: FirebaseUser | null;
  authLoading: boolean;
  
  // Firestore kullanıcı verisi
  currentUser: User | null;
  userLoading: boolean;
  
  // Computed values
  isAdmin: boolean;
  isPremium: boolean;
  
  // Actions
  setAuthUser: (user: FirebaseUser | null) => void;
  setAuthLoading: (loading: boolean) => void;
  loadUserData: (authUid: string) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  authUser: null,
  authLoading: true,
  currentUser: null,
  userLoading: false,
  isAdmin: false,
  isPremium: false,
  
  // Actions
  setAuthUser: (user) => {
    set({ authUser: user });
    
    // Auth user değiştiğinde Firestore verisini yükle
    if (user) {
      get().loadUserData(user.uid);
    } else {
      set({ currentUser: null });
    }
  },
  
  setAuthLoading: (loading) => set({ authLoading: loading }),
  
  loadUserData: async (authUid: string) => {
    set({ userLoading: true });
    try {
      let userData = await getUserByAuthUid(authUid);
      
      // Eğer kullanıcı Firestore'da yoksa, oluştur
      if (!userData) {
        const authUser = get().authUser;
        if (authUser) {
          console.log('Firestore\'da kullanıcı bulunamadı, yeni kullanıcı oluşturuluyor...');
          userData = await createUser(
            authUser.uid,
            authUser.email || '',
            authUser.displayName
          );
        }
      }
      
      set({ 
        currentUser: userData,
        userLoading: false,
        isAdmin: userData?.role === 'admin',
        isPremium: userData?.membership === 'premium'
      });
    } catch (error) {
      console.error('Kullanıcı verisi yüklenirken hata:', error);
      set({ 
        currentUser: null,
        userLoading: false,
        isAdmin: false,
        isPremium: false
      });
    }
  },
  
  setCurrentUser: (user) => set({ 
    currentUser: user,
    isAdmin: user?.role === 'admin',
    isPremium: user?.membership === 'premium'
  }),
  
  clearUser: () => set({
    authUser: null,
    authLoading: false,
    currentUser: null,
    userLoading: false,
    isAdmin: false,
    isPremium: false
  })
}));