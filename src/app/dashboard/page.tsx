"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserByAuthUid, updateUser } from "@/services/firebase";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMotorcycleImage } from "@/utils/motorcycle-images";
import EditTagModal from "@/components/EditTagModal";
import QRCodeModal from "@/components/QRCodeModal";

export default function Dashboard() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userTag, setUserTag] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        router.push("/");
        return;
      }
      loadUserTag();
    }
  }, [authUser, authLoading, router]);

  const loadUserTag = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const tag = await getUserByAuthUid(authUser.uid);
      setUserTag(tag);
    } catch (err) {
      console.error("Tag yükleme hatası:", err);
      setError("Tag bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTagStatus = async () => {
    if (!userTag) return;

    try {
      const newStatus = !userTag.isActive;
      await updateUser(userTag.id, { isActive: newStatus });
      setUserTag({ ...userTag, isActive: newStatus });
    } catch (err) {
      console.error("Tag durumu güncelleme hatası:", err);
      setError("Tag durumu güncellenirken bir hata oluştu.");
    }
  };

  const handleEditSuccess = (updatedUser: User) => {
    setUserTag(updatedUser);
    setError(null);
  };

  const handleEditError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (authLoading || loading) {
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
          <Link
            href="/"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
          >
            ← Ana Sayfa
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!userTag ? (
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
                href="/"
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
                Tag Oluştur
              </Link>
            </div>
          </div>
        ) : (
          // Tag var - göster
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tag Önizleme */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Tag&apos;iniz</h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        userTag.isActive
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {userTag.isActive ? "Aktif" : "Pasif"}
                    </span>
                    <button
                      onClick={toggleTagStatus}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        userTag.isActive
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {userTag.isActive ? "Deaktif Et" : "Aktif Et"}
                    </button>
                  </div>
                </div>

                {/* Tag Bilgileri */}
                <div className="space-y-6">
                  {/* Kişisel Bilgiler */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 border-b border-slate-600 pb-2">
                      Kişisel Bilgiler
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Ad Soyad
                        </label>
                        <p className="text-white">
                          {userTag.personalInfo.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Telefon
                        </label>
                        <p className="text-white">
                          {userTag.personalInfo.phone}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          E-posta
                        </label>
                        <p className="text-white">
                          {userTag.personalInfo.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Kan Grubu
                        </label>
                        <p className="text-white">
                          {userTag.personalInfo.bloodType}
                        </p>
                      </div>
                      {userTag.personalInfo.instagram && (
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Instagram
                          </label>
                          <p className="text-white">
                            {userTag.personalInfo.instagram}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motosiklet Bilgileri */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 border-b border-slate-600 pb-2">
                      Motosiklet Bilgileri
                    </h3>
                    <div className="flex items-start gap-4">
                      <Image
                        src={getMotorcycleImage(userTag.theme)}
                        alt={`${userTag.motorcycle.brand} motosiklet`}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain rounded-lg border border-slate-600 bg-slate-700/50"
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Marka
                          </label>
                          <p className="text-white">
                            {userTag.motorcycle.brand}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Model
                          </label>
                          <p className="text-white">
                            {userTag.motorcycle.model}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm text-slate-400 mb-1">
                            Plaka
                          </label>
                          <p className="text-white">
                            {userTag.motorcycle.plate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acil Durum */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 border-b border-slate-600 pb-2">
                      Acil Durum İletişim
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Acil Durum Kişisi
                        </label>
                        <p className="text-white">{userTag.emergency.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Telefon
                        </label>
                        <p className="text-white">{userTag.emergency.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Not */}
                  {userTag.note && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 border-b border-slate-600 pb-2">
                        Özel Not
                      </h3>
                      <p className="text-slate-300 bg-slate-700/30 rounded-lg p-3">
                        {userTag.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Yan Panel */}
            <div className="space-y-6">
              {/* Tag Linki */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Tag Linkiniz</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
                    <input
                      type="text"
                      value={`${window.location.origin}/${userTag.uniqueUrl}`}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-slate-300 border-none outline-none"
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/${userTag.uniqueUrl}`
                        )
                      }
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                    >
                      Kopyala
                    </button>
                  </div>
                  <Link
                    href={`/${userTag.uniqueUrl}`}
                    target="_blank"
                    className="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg transition-colors duration-200"
                  >
                    Tag&apos;i Görüntüle
                  </Link>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">İstatistikler</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Oluşturma Tarihi:</span>
                    <span className="text-white">
                      {userTag.createdAt?.toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Son Güncelleme:</span>
                    <span className="text-white">
                      {userTag.updatedAt?.toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Durum:</span>
                    <span
                      className={
                        userTag.isActive ? "text-green-400" : "text-red-400"
                      }
                    >
                      {userTag.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Üyelik:</span>
                    <span
                      className={
                        userTag.isPremium ? "text-yellow-400" : "text-slate-400"
                      }
                    >
                      {userTag.isPremium ? "Premium" : "Ücretsiz"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Eylemler */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Eylemler</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Tag&apos;i Düzenle
                  </button>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 11v8h8v-8H3zm2 2h4v4H5v-4zM3 3v8h8V3H3zm2 2h4v4H5V5zm8-2v8h8V3h-8zm2 2h4v4h-4V5zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
                    </svg>
                    QR Kodu Görüntüle
                  </button>
                  <button
                    className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Premium&apos;a Yükselt (Yakında)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {userTag && (
          <EditTagModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            userTag={userTag}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
          />
        )}

        {/* QR Code Modal */}
        {userTag && (
          <QRCodeModal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            userTag={userTag}
          />
        )}
      </div>
    </div>
  );
}
