"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import CreateTagForm from "@/components/CreateTagForm";
import Link from "next/link";

export default function CreateTagPage() {
  const { user, loading: authLoading } = useAuth();
  const { currentUser, userLoading, isPremium } = useUserStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Auth kontrolü
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Giriş Yapmanız Gerekiyor
          </h2>
          <p className="text-slate-400 mb-6">
            Tag oluşturmak için lütfen önce giriş yapın.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    setSuccessMessage("Tag başarıyla oluşturuldu! Dashboard'a yönlendiriliyorsunuz...");
    setErrorMessage(null);
    
    // 2 saniye sonra dashboard'a yönlendir
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Asnus Tag
            </Link>
            <div>
              <h1 className="text-3xl font-bold mb-2">Yeni Tag Oluştur</h1>
              <p className="text-slate-300">
                Motosikletiniz için dijital iletişim kartı oluşturun
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Create Tag Form */}
        <CreateTagForm
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Premium Banner for Non-Premium Users */}
        {currentUser && !isPremium && currentUser.tags?.length >= (currentUser.maxTags || 1) && (
          <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">
              🚀 Premium'a Geçin!
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Sınırsız tag oluşturun, özel temalar kullanın ve daha fazla özellikten yararlanın.
            </p>
            <Link
              href="/premium"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Premium'u Keşfet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}