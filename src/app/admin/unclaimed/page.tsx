"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { getUnclaimedTags, createBulkBrandlessTags, createBrandlessTag } from "@/services/tagService";
import { Tag } from "@/types/user";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";

export default function UnclaimedTagsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, userLoading, isAdmin } = useUserStore();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !userLoading) {
      if (!authUser || !isAdmin) {
        router.push("/");
        return;
      }
      loadUnclaimedTags();
    }
  }, [authUser, authLoading, userLoading, isAdmin, router]);

  const loadUnclaimedTags = async () => {
    try {
      setLoading(true);
      const unclaimedTags = await getUnclaimedTags();
      setTags(unclaimedTags);
    } catch (err) {
      console.error("Sahipsiz taglar yüklenirken hata:", err);
      setError("Sahipsiz taglar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    if (creating || bulkCount < 1 || bulkCount > 100) return;
    
    setCreating(true);
    setError(null);
    
    try {
      await createBulkBrandlessTags(bulkCount);
      await loadUnclaimedTags(); // Listeyi yenile
      setBulkCount(10); // Reset
    } catch (err: any) {
      console.error("Toplu tag oluşturma hatası:", err);
      setError(err.message || "Tag oluşturulurken bir hata oluştu.");
    } finally {
      setCreating(false);
    }
  };

  const handleSingleCreate = async () => {
    if (creating) return;
    
    setCreating(true);
    setError(null);
    
    try {
      await createBrandlessTag();
      await loadUnclaimedTags(); // Listeyi yenile
    } catch (err: any) {
      console.error("Tekil tag oluşturma hatası:", err);
      setError(err.message || "Tag oluşturulurken bir hata oluştu.");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Basit toast notification
      const toast = document.createElement('div');
      toast.textContent = 'URL kopyalandı!';
      toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  if (authLoading || userLoading || loading) {
    return (
      <AdminLayout title="Sahipsiz Taglar" subtitle="Henüz sahiplenilmemiş tagları yönetin">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sahipsiz Taglar" subtitle="Henüz sahiplenilmemiş tagları yönetin">
      <div className="space-y-6">
        {/* Tag Oluşturma Yönetimi */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Tag Oluşturma Yönetimi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tekil Oluşturma */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Tekil Tag Oluştur</h4>
              <p className="text-sm text-slate-400">Tek bir sahipsiz tag oluşturun</p>
              <button
                onClick={handleSingleCreate}
                disabled={creating}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {creating ? 'Oluşturuluyor...' : 'Tek Tag Oluştur'}
              </button>
            </div>

            {/* Toplu Oluşturma */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Toplu Tag Oluştur</h4>
              <p className="text-sm text-slate-400">Birden fazla sahipsiz tag oluşturun (Maks: 100)</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tag Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="10"
                  />
                </div>
                <button
                  onClick={handleBulkCreate}
                  disabled={creating || bulkCount < 1 || bulkCount > 100}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {creating ? 'Oluşturuluyor...' : `${bulkCount} Tag Oluştur`}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* İstatistikler */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Toplam Sahipsiz Tag</h3>
              <p className="text-3xl font-bold text-yellow-400 mt-2">{tags.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tag Listesi */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Sahipsiz Tag Listesi</h3>
            <button
              onClick={loadUnclaimedTags}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yenile
            </button>
          </div>

          {tags.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sahipsiz Tag Bulunamadı</h3>
              <p className="text-slate-400">Henüz sahiplenilmemiş tag bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <h4 className="font-medium text-white">Tag #{tag.id.slice(-6)}</h4>
                      <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                        {new Date(tag.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>URL: {tag.uniqueUrl}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/${tag.uniqueUrl}`)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Kopyala
                    </button>
                    <a
                      href={`/${tag.uniqueUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Görüntüle
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}