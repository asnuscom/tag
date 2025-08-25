"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@/types/user";
import QRCardGenerator from "./QRCardGenerator";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTag: User;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  userTag,
}: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const fullUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"
  }/${userTag.uniqueUrl}`;

  const handleQRGenerated = (dataUrl: string) => {
    setQrCodeDataUrl(dataUrl);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert("Link kopyalandı!");
    } catch (error) {
      console.error("Link kopyalama hatası:", error);
      alert("Link kopyalanırken bir hata oluştu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">QR Kod</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center">
          {/* Kullanıcı Bilgileri */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src={userTag.motorcycle.image}
                  alt={`${userTag.motorcycle.brand} ${userTag.motorcycle.model}`}
                  width={80}
                  height={60}
                  className="object-contain rounded-lg bg-slate-700/30 p-2"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 border border-slate-600">
                  {userTag.motorcycle.brand}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {userTag.personalInfo.name}
            </h3>
            <p className="text-slate-400 text-sm">
              {userTag.motorcycle.brand} {userTag.motorcycle.model} •{" "}
              {userTag.motorcycle.plate}
            </p>
          </div>

          {/* QR Kod Generator */}
          <QRCardGenerator
            userTag={userTag}
            fullUrl={fullUrl}
            onQRGenerated={handleQRGenerated}
          />

          {/* URL Bilgisi */}
          <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-400 mb-2">Tag URL'niz:</p>
            <p className="text-blue-400 font-mono text-xs break-all">
              {fullUrl}
            </p>
          </div>

          {/* Ek Eylemler */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Kopyala
            </button>

            <a
              href={`/${userTag.uniqueUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Aç
            </a>
          </div>

          {/* Bilgilendirme */}
          <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-xs text-slate-300 space-y-1">
              <p>• QR kodu motosikletinizin görünür bir yerine yapıştırın</p>
              <p>• Tag'iniz 7/24 erişilebilir durumda</p>
              <p>• Acil durumlarda hızla iletişim sağlar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
