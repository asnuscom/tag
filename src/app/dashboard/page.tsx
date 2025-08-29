"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { getUserTags, updateTag as updateTagService, deleteTag as deleteTagService, updateTagStatus } from "@/services/tagService";
import { Tag } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

import MotorcycleLogo from "@/components/MotorcycleLogo";
import EditTagModal from "@/components/EditTagModal";
import QRCodeModal from "@/components/QRCodeModal";

export default function Dashboard() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { 
    currentUser, 
    userLoading, 
    isAdmin, 
    isPremium 
  } = useUserStore();
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const router = useRouter();


  const loadUserTags = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const tags = await getUserTags(currentUser.id);
      setUserTags(tags);
    } catch (err) {
      console.error("Kullanıcı tag'leri yükleme hatası:", err);
      setError("Tag'ler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/");
      return;
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    if (currentUser) {
      loadUserTags();
    }
  }, [currentUser, loadUserTags]);

  const handleToggleTagStatus = async (tagId: string, isActive: boolean) => {
    if (!authUser || !currentUser) return;

    try {
      await updateTagStatus(tagId, !isActive);
      
      // Local state'i güncelle
      const updatedTags = userTags.map(tag => 
        tag.id === tagId ? { ...tag, isActive: !isActive } : tag
      );
      setUserTags(updatedTags);
    } catch (err) {
      console.error("Tag durumu güncelleme hatası:", err);
      setError("Tag durumu güncellenirken bir hata oluştu.");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!authUser || !currentUser) return;
    
    if (!confirm("Bu tag'ı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      await deleteTagService(tagId);
      
      // Local state'i güncelle
      const updatedTags = userTags.filter(tag => tag.id !== tagId);
      setUserTags(updatedTags);
    } catch (err) {
      console.error("Tag silme hatası:", err);
      setError("Tag silinirken bir hata oluştu.");
    }
  };

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag);
    setShowEditModal(true);
  };

  const handleShowQR = (tag: Tag) => {
    setSelectedTag(tag);
    setShowQRModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedTag(null);
    loadUserTags(); // Verileri yeniden yükle
  };

  const handleEditError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (authLoading || userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null; // Router redirect will handle this
  }

  const activeTags = userTags.filter(tag => tag.isActive);
  const inactiveTags = userTags.filter(tag => !tag.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kontrol Paneli</h1>
            <p className="text-slate-300">
              Merhaba, {authUser.displayName || authUser.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              ← Ana Sayfa
            </Link>
            {/* Admin kullanıcıları için admin panel linki */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Kullanıcı İstatistikleri */}
        {currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Toplam Tag</p>
                  <p className="text-2xl font-bold text-white">{userTags.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 11v8h8v-8H3zm2 2h4v4H5v-4zM3 3v8h8V3H3zm2 2h4v4H5V5zm8-2v8h8V3h-8zm2 2h4v4h-4V5zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Aktif Tag</p>
                  <p className="text-2xl font-bold text-green-400">{activeTags.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tag Limiti</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {userTags.length}/{isPremium ? '∞' : currentUser?.maxTags}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Üyelik Durumu</p>
                  <p className={`text-2xl font-bold ${isPremium ? 'text-yellow-400' : 'text-slate-400'}`}>
                    {isPremium ? 'Premium' : 'Ücretsiz'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentUser || userTags.length === 0 ? (
          // Henüz tag oluşturmamış
          <div className="text-center py-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-400"
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
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Henüz Tag&apos;iniz Yok
              </h2>
              <p className="text-slate-400 mb-6">
                Motosikletiniz için özel bir dijital iletişim kartı oluşturun.
              </p>
              <Link
                href="/create-tag"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
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
                İlk Tag&apos;inizi Oluşturun
              </Link>
            </div>
          </div>
        ) : (
          // Tag'lar var - listele
          <div className="space-y-8">
            {/* Aktif Taglar */}
            {activeTags.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Aktif Tag&apos;lar</h2>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                    {activeTags.length} aktif
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTags.map((tag) => (
                    <TagCard
                      key={tag.id}
                      tag={tag}
                      onToggleStatus={() => handleToggleTagStatus(tag.id, tag.isActive)}
                      onEdit={() => handleEditTag(tag)}
                      onShowQR={() => handleShowQR(tag)}
                      onDelete={() => handleDeleteTag(tag.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pasif Taglar */}
            {inactiveTags.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Pasif Tag&apos;lar</h2>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                    {inactiveTags.length} pasif
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inactiveTags.map((tag) => (
                    <TagCard
                      key={tag.id}
                      tag={tag}
                      onToggleStatus={() => handleToggleTagStatus(tag.id, tag.isActive)}
                      onEdit={() => handleEditTag(tag)}
                      onShowQR={() => handleShowQR(tag)}
                      onDelete={() => handleDeleteTag(tag.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yeni Tag Oluştur Butonu */}
            <div className="text-center py-8">
              <Link
                href="/create-tag"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
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
                Yeni Tag Oluştur
              </Link>
              
              {/* Premium olmayanlar için uyarı */}
              {currentUser && !isPremium && userTags.length >= (currentUser.maxTags || 1) && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-md mx-auto">
                  <p className="text-yellow-400 text-sm mb-2">
                    Tag limitinize ulaştınız. Daha fazla tag oluşturmak için Premium&apos;a geçin.
                  </p>
                  <Link 
                    href="/premium"
                    className="text-yellow-400 hover:text-yellow-300 underline text-sm"
                  >
                    Premium&apos;a Geç →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {selectedTag && (
          <EditTagModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedTag(null);
            }}
            tag={selectedTag}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
          />
        )}

        {/* QR Code Modal */}
        {selectedTag && (
          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => {
              setShowQRModal(false);
              setSelectedTag(null);
            }}
            tag={selectedTag}
          />
        )}
      </div>
    </div>
  );
}

// Tag Kartı Komponenti
interface TagCardProps {
  tag: Tag;
  onToggleStatus: () => void;
  onEdit: () => void;
  onShowQR: () => void;
  onDelete: () => void;
}

function TagCard({ tag, onToggleStatus, onEdit, onShowQR, onDelete }: TagCardProps) {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-200 hover:bg-slate-800/70 ${
      tag.isActive 
        ? "border-slate-700 hover:border-green-500/30" 
        : "border-red-500/30"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MotorcycleLogo
            brand={tag.motorcycle.brand}
            size="sm"
            variant="dashboard"
          />
          <div>
            <h3 className="font-semibold text-white">
              {tag.name}
            </h3>
            <p className="text-xs text-slate-400">
              {tag.motorcycle.brand} {tag.motorcycle.model}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            tag.isActive
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {tag.isActive ? "Aktif" : "Pasif"}
        </span>
      </div>

      {/* Tag Bilgileri */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-xs text-slate-400">Plaka:</span>
          <span className="text-xs text-white">{tag.motorcycle.plate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-slate-400">Kişi:</span>
          <span className="text-xs text-white">{tag.personalInfo.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-slate-400">URL:</span>
          <Link
            href={`/${tag.uniqueUrl}`}
            target="_blank"
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            {tag.uniqueUrl.substring(0, 12)}...
          </Link>
        </div>
      </div>

      {/* Eylem Butonları */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={onToggleStatus}
          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors duration-200 ${
            tag.isActive
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {tag.isActive ? "Deaktif Et" : "Aktif Et"}
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors duration-200"
        >
          Düzenle
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onShowQR}
          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium transition-colors duration-200"
        >
          QR Kod
        </button>
        <Link
          href={`/${tag.uniqueUrl}`}
          target="_blank"
          className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium text-center transition-colors duration-200"
        >
          Görüntüle
        </Link>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors duration-200"
        >
          Sil
        </button>
      </div>
    </div>
  );
}