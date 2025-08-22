"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  uniqueUrl: string;
  userInfo: {
    name: string;
    motorcycleBrand: string;
    motorcycleModel: string;
    motorcycleImage: string;
  };
}

export default function QRCodeDisplay({
  uniqueUrl,
  userInfo,
}: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${uniqueUrl}`;

  // QR kodu client-side&apos;da oluştur
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const canvas = canvasRef.current;
        if (canvas) {
          await QRCode.toCanvas(canvas, fullUrl, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
            errorCorrectionLevel: "M",
          });

          // Canvas&apos;ı data URL&apos;e çevir
          const dataUrl = canvas.toDataURL("image/png");
          setQrCodeDataUrl(dataUrl);
        }
      } catch (error) {
        console.error("QR kod oluşturma hatası:", error);
      }
    };

    generateQRCode();
  }, [fullUrl]);

  const downloadQRCode = async () => {
    setIsDownloading(true);
    try {
      if (qrCodeDataUrl) {
        const link = document.createElement("a");
        link.href = qrCodeDataUrl;
        link.download = `${userInfo.name.replace(
          /\s+/g,
          "-"
        )}-motosiklet-tag.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("QR kod indirme hatası:", error);
      alert("QR kod indirilirken bir hata oluştu.");
    } finally {
      setIsDownloading(false);
    }
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

  return (
    <div className="max-w-lg mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 text-center">
      {/* Başarı Mesajı */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          🎉 Tag&apos;iniz Hazır!
        </h2>
        <p className="text-slate-300 mb-4">
          {userInfo.motorcycleBrand} {userInfo.motorcycleModel} için dijital
          iletişim kartınız başarıyla oluşturuldu.
        </p>

        {/* Motosiklet Görseli */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src={userInfo.motorcycleImage}
              alt={`${userInfo.motorcycleBrand} ${userInfo.motorcycleModel}`}
              width={120}
              height={80}
              className="object-contain rounded-lg bg-slate-700/30 p-2"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 border border-slate-600">
              {userInfo.motorcycleBrand}
            </div>
          </div>
        </div>
      </div>

      {/* QR Kod */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-xl inline-block mb-4">
          <canvas
            ref={canvasRef}
            className="rounded-lg"
            style={{ display: qrCodeDataUrl ? "block" : "none" }}
          />
          {!qrCodeDataUrl && (
            <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Oluşturuluyor...</span>
            </div>
          )}
        </div>

        <div className="text-sm text-slate-400 mb-4">
          <p>QR kodu motosikletinize yapıştırın</p>
          <p className="text-xs mt-1">
            Acil durumlarda iletişim bilgilerinize hızla erişim sağlar
          </p>
        </div>
      </div>

      {/* URL Bilgisi */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
        <p className="text-sm text-slate-400 mb-2">Tag URL&apos;niz:</p>
        <p className="text-blue-400 font-mono text-sm break-all">{fullUrl}</p>
      </div>

      {/* Aksiyon Butonları */}
      <div className="space-y-3">
        <button
          onClick={downloadQRCode}
          disabled={isDownloading}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              İndiriliyor...
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              QR Kodu İndir
            </>
          )}
        </button>

        <button
          onClick={copyToClipboard}
          className="w-full px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300 flex items-center justify-center gap-2"
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
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Link&apos;i Kopyala
        </button>

        <a
          href={`/${uniqueUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Tag&apos;imi Görüntüle
        </a>
      </div>

      {/* Bilgilendirme */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">
          💡 Önemli Bilgiler
        </h3>
        <div className="text-xs text-slate-300 space-y-1">
          <p>• QR kodu motosikletinizin görünür bir yerine yapıştırın</p>
          <p>• Tag&apos;iniz 7/24 erişilebilir durumda</p>
          <p>• Bilgilerinizi güncellemek için bizimle iletişime geçin</p>
          <p>• Premium üyelikle reklamları kaldırabilirsiniz</p>
        </div>
      </div>

      {/* Premium Yükseltme */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
        <h3 className="text-sm font-semibold text-purple-400 mb-2">
          ⭐ Premium&apos;a Yükselt
        </h3>
        <p className="text-xs text-slate-300 mb-3">
          Reklamları kaldır, özel tasarımlar ve daha fazla özellik
        </p>
        <a
          href="mailto:premium@asnus.com?subject=Premium Üyelik"
          className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
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
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          Premium&apos;a Yükselt
        </a>
      </div>
    </div>
  );
}
