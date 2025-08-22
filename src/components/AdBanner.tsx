"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
  position: "top" | "bottom" | "sidebar";
  showAds: boolean;
  className?: string;
}

export default function AdBanner({
  position,
  showAds,
  className = "",
}: AdBannerProps) {
  const [adContent, setAdContent] = useState<{
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    company: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!showAds) {
      setIsLoading(false);
      return;
    }

    // Simüle edilmiş reklam içeriği - gerçek projede reklam servisi entegrasyonu yapılacak
    const loadAd = () => {
      setTimeout(() => {
        const sampleAds = [
          {
            id: 1,
            title: "Motosiklet Aksesuarları",
            description: "En kaliteli motosiklet aksesuarları için",
            image: "/assets/ads/accessories.jpg",
            link: "https://example.com/accessories",
            company: "Moto Aksesuar",
          },
          {
            id: 2,
            title: "Motosiklet Sigortası",
            description: "En uygun fiyatlı sigorta poliçeleri",
            image: "/assets/ads/insurance.jpg",
            link: "https://example.com/insurance",
            company: "Güvenli Sigorta",
          },
          {
            id: 3,
            title: "Motosiklet Servisi",
            description: "Uzman teknisyenlerle profesyonel bakım",
            image: "/assets/ads/service.jpg",
            link: "https://example.com/service",
            company: "Pro Servis",
          },
        ];

        const randomAd =
          sampleAds[Math.floor(Math.random() * sampleAds.length)];
        setAdContent(randomAd);
        setIsLoading(false);
      }, 1000);
    };

    loadAd();
  }, [showAds]);

  // Reklam gösterilmiyorsa hiçbir şey render etme
  if (!showAds) {
    return null;
  }

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div
        className={`bg-slate-800/30 border border-slate-700 rounded-lg p-4 animate-pulse ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-600 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-600 rounded w-3/4" />
            <div className="h-3 bg-slate-600 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Reklam içeriği
  if (!adContent) return null;

  const handleAdClick = () => {
    // Reklam tıklama analitik verisi gönder
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "ad_click", {
        ad_id: adContent.id,
        ad_company: adContent.company,
        ad_position: position,
      });
    }

    window.open(adContent.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 transition-all duration-300 hover:border-slate-500/70 ${className}`}
    >
      {/* Reklam Etiketi */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-500 font-medium bg-slate-700/50 px-2 py-1 rounded">
          REKLAM
        </span>
        <a
          href="mailto:premium@asnus.com?subject=Premium Üyelik - Reklam Kaldırma"
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Reklamları kaldır
        </a>
      </div>

      {/* Reklam İçeriği */}
      <div onClick={handleAdClick} className="cursor-pointer group">
        <div className="flex items-center gap-4">
          {/* Reklam Görseli */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* Reklam Metni */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
              {adContent.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {adContent.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">
                {adContent.company}
              </span>
              <svg
                className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Yükseltme Teşviki */}
      <div className="mt-3 pt-3 border-t border-slate-600/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Premium üyelerle reklamları kaldırın
          </span>
          <a
            href="mailto:premium@asnus.com?subject=Premium Üyelik"
            className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30 hover:border-purple-400/50 transition-colors duration-300"
          >
            ⭐ Premium
          </a>
        </div>
      </div>
    </div>
  );
}

// Google Analytics için tip tanımlaması
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
