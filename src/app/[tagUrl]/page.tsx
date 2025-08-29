"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getTagByUniqueUrl } from "@/services/tagService";
import { Tag, User } from "@/types/user";
import { themes } from "@/config/themes";
import demoUsersData from "@/data/demo-users.json";
import TagCard from "@/components/TagCard";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import TagClaimForm from "@/components/TagClaimForm";
import TagDisplay from "@/components/TagDisplay";

export default function UniversalPage({ params }: { params: Promise<{ tagUrl: string }> }) {
  const { user: authUser } = useAuth();
  const { currentUser } = useUserStore();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClaimForm, setShowClaimForm] = useState(false);

  const resolvedParams = use(params);
  const urlParam = resolvedParams.tagUrl;

  useEffect(() => {
    const loadContent = async () => {
      if (!urlParam) return;

      try {
        setLoading(true);
        
        // Önce tag olarak ara
        const tagData = await getTagByUniqueUrl(urlParam);
        
        if (tagData) {
          setTag(tagData);
        } else {
          const demoTags = demoUsersData as Record<string, Tag>;
          const demoTag = demoTags[urlParam];
          
          if (demoTag) {
            setTag(demoTag as Tag);
          } else {
            setError("Aradığınız motosiklet kartı sistemde kayıtlı değil.");
          }
        }
      } catch (err) {
        setError("İçerik yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [urlParam, authUser, currentUser]);

  const handleClaimSuccess = (claimedTag: Tag) => {
    setTag(claimedTag);
      (claimedTag as any);
    setShowClaimForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || (!tag)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">İçerik Bulunamadı</h1>
          <p className="text-slate-300 mb-6">{error || "Bu sayfa mevcut değil veya kaldırılmış."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // Sahipsiz tag ise claim form göster (userId boş string veya falsy)
  if (tag && tag.tag !== 'DEMO' && (!tag.isClaimed || !tag.userId || tag.userId === '')) {
    if (!authUser) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Sahipsiz Tag</h1>
              <p className="text-slate-300 mb-6">
                Bu tag henüz kimseye ait değil. Sahiplenmek ve kişiselleştirmek için giriş yapmanız gerekiyor.
              </p>
              <div className="space-y-3">
                <a
                  href={`/login?returnUrl=${encodeURIComponent(`/${urlParam}`)}`}
                  className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  Giriş Yap
                </a>
                <a
                  href={`/signup?returnUrl=${encodeURIComponent(`/${urlParam}`)}`}
                  className="block w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                >
                  Üye Ol
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showClaimForm) {
      return (
        <TagClaimForm
          tag={tag}
          onSuccess={handleClaimSuccess}
          onCancel={() => setShowClaimForm(false)}
        />
      );
    }

    // Giriş yapmış ama henüz claim formu göstermemişse
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Sahipsiz Tag</h1>
            <p className="text-slate-300 mb-6">
              Bu tag henüz sahiplenilmemiş. Hemen sahiplenip kişiselleştirebilirsiniz!
            </p>
            <button
              onClick={() => setShowClaimForm(true)}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Tag'i Sahiplen
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (tag) {
    const theme = themes[tag.theme];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <TagCard tag={tag} theme={theme} />
      </div>
    );
  }
  else {
    return <div>Tag bulunamadı</div>;
  }

}