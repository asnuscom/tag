"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserByAuthUid, canUserCreateTag } from "@/services/userService";
import { getUserTags } from "@/services/tagService";
import { Tag } from "@/types/user";
import CreateTagForm from "./CreateTagForm";
import QRCodeDisplay from "./QRCodeDisplay";
import AuthModal from "./AuthModal";

export default function CreateTagSection() {
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [canCreate, setCanCreate] = useState(true);
  const [limitMessage, setLimitMessage] = useState('');
  const [checkingTag, setCheckingTag] = useState(false);
  const [createdTag, setCreatedTag] = useState<Tag | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Kullanıcının tag'lerini ve oluşturma durumunu kontrol et
  useEffect(() => {
    const checkUserTags = async () => {
      if (user && !loading) {
        setCheckingTag(true);
        try {
          // Önce kullanıcı bilgilerini al
          const userData = await getUserByAuthUid(user.uid);
          if (userData) {
            const tags = await getUserTags(userData.id);
            setUserTags(tags);
            
            const canCreateResult = await canUserCreateTag(userData.id);
            setCanCreate(canCreateResult.canCreate);
            setLimitMessage(canCreateResult.reason || '');
          }
        } catch (error) {
          console.error("Tag kontrolü hatası:", error);
        } finally {
          setCheckingTag(false);
        }
      } else if (!user && !loading) {
        setUserTags([]);
        setCanCreate(true);
        setLimitMessage('');
        setCheckingTag(false);
      }
    };

    checkUserTags();
  }, [user, loading]);

  const handleFormSuccess = (newTag: Tag) => {
    setCreatedTag(newTag);
    setShowForm(false);
    setError(null);
    // Tag listesini güncelle
    setUserTags(prev => [...prev, newTag]);
    // Oluşturma durumunu yeniden kontrol et
    if (user) {
      getUserByAuthUid(user.uid).then(userData => {
        if (userData) {
          canUserCreateTag(userData.id).then(result => {
            setCanCreate(result.canCreate);
            setLimitMessage(result.reason || '');
          });
        }
      });
    }
  };

  const handleFormError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetForm = () => {
    setShowForm(false);
    setCreatedTag(null);
    setError(null);
  };

  const handleCreateClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Kullanıcının zaten tag'i varsa dashboard'a yönlendir
    if (userTags.length > 0) {
      window.location.href = "/dashboard";
      return;
    }
    
    // Tag oluşturma limiti kontrolü
    if (!canCreate) {
      setError(limitMessage || 'Tag oluşturma limitinize ulaştınız.');
      return;
    }

    setShowForm(true);
  };

  // Başarılı oluşturma durumu
  if (createdTag) {
    return (
      <div className="py-12 md:py-16">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-green-400">
              Tag Başarıyla Oluşturuldu!
            </h2>
            <p className="text-slate-300 mb-6">
              "{createdTag.name}" adlı tag'iniz hazır. QR kodunu indirin ve motosikletinize yapıştırın.
            </p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Tag Adı:</span>
                <span className="text-white font-medium">{createdTag.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Motosiklet:</span>
                <span className="text-white">{createdTag.motorcycle.brand} {createdTag.motorcycle.model}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">URL:</span>
                <a 
                  href={`/${createdTag.uniqueUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {createdTag.uniqueUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${createdTag.uniqueUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Tag'ı Görüntüle
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Panelime Git
            </a>
          </div>
          
          {canCreate && (
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300"
            >
              Yeni Tag Oluştur
            </button>
          )}
        </div>
      </div>
    );
  }

  // Form gösterme durumu
  if (showForm) {
    return (
      <div className="py-12 md:py-16">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <CreateTagForm
          onSuccess={handleFormSuccess}
          onError={handleFormError}
        />

        <div className="text-center mt-8">
          <button
            onClick={() => setShowForm(false)}
            className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Ana CTA bölümü
  return (
    <div className="text-center py-12 md:py-16">
      <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30 mb-4">
            🚀 Ücretsiz Oluştur
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Kendi Tag&apos;inizi Hemen Oluşturun
        </h2>

        <p className="text-slate-300 mb-6 text-sm md:text-base">
          Motosikletiniz için özel tasarlanmış, profesyonel dijital iletişim
          kartınızı dakikalar içinde oluşturun. QR kodunu indirin ve
          motosikletinize yapıştırın.
        </p>

        {/* Özellikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Hızlı Oluşturma
            </h3>
            <p className="text-xs text-slate-400">2 dakikada hazır</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Güvenli</h3>
            <p className="text-xs text-slate-400">SSL korumalı</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Ücretsiz</h3>
            <p className="text-xs text-slate-400">Temel özellikler</p>
          </div>
        </div>

        <button
          onClick={handleCreateClick}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          {loading || checkingTag ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Yükleniyor...
            </>
          ) : !user ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Giriş Yaparak Oluştur
            </>
          ) : userTags.length > 0 ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Panelim ({userTags.length} Tag)
            </>
          ) : !canCreate ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Premium Gerekli
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Hemen Oluştur
            </>
          )}
        </button>

        <div className="text-xs text-slate-500 mt-4 space-y-1">
          <p>
            Oluşturma ücretsizdir • Premium özellikler için{" "}
            <a
              href="mailto:ihsansunman@asnus.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              iletişime geçin
            </a>
          </p>
          {!canCreate && (
            <p className="text-yellow-400">
              Ücretsiz kullanıcılar sadece 1 tag oluşturabilir
            </p>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
}
