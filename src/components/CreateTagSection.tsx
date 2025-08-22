"use client";

import { useState } from "react";
import CreateTagForm from "./CreateTagForm";
import QRCodeDisplay from "./QRCodeDisplay";

export default function CreateTagSection() {
  const [showForm, setShowForm] = useState(false);
  const [createdTag, setCreatedTag] = useState<{
    uniqueUrl: string;
    qrCodeUrl: string;
    userInfo: {
      name: string;
      motorcycleBrand: string;
      motorcycleModel: string;
      motorcycleImage: string;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSuccess = (
    uniqueUrl: string,
    qrCodeUrl: string,
    userInfo: {
      name: string;
      motorcycleBrand: string;
      motorcycleModel: string;
      motorcycleImage: string;
    }
  ) => {
    setCreatedTag({
      uniqueUrl,
      qrCodeUrl,
      userInfo,
    });
    setShowForm(false);
    setError(null);
  };

  const handleFormError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetForm = () => {
    setShowForm(false);
    setCreatedTag(null);
    setError(null);
  };

  // Başarılı oluşturma durumu
  if (createdTag) {
    return (
      <div className="py-12 md:py-16">
        <QRCodeDisplay
          qrCodeUrl={createdTag.qrCodeUrl}
          uniqueUrl={createdTag.uniqueUrl}
          userInfo={createdTag.userInfo}
        />

        <div className="text-center mt-8">
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300"
          >
            Yeni Tag Oluştur
          </button>
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
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
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
          Hemen Oluştur
        </button>

        <p className="text-xs text-slate-500 mt-4">
          Oluşturma ücretsizdir • Premium özellikler için{" "}
          <a
            href="mailto:premium@asnus.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            iletişime geçin
          </a>
        </p>
      </div>
    </div>
  );
}
