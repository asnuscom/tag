"use client";

import { useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import { User } from "@/types/user";

interface QRCardGeneratorProps {
  userTag: User;
  fullUrl: string;
  onQRGenerated?: (dataUrl: string) => void;
}

export default function QRCardGenerator({
  userTag,
  fullUrl,
  onQRGenerated,
}: QRCardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [cardReady, setCardReady] = useState(false);

  useEffect(() => {
    generateQRCard();
  }, [fullUrl, userTag]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateQRCard = async () => {
    try {
      const canvas = canvasRef.current;
      const cardCanvas = cardCanvasRef.current;

      if (!canvas || !cardCanvas) return;

      // Önce sadece QR kodu oluştur
      await QRCode.toCanvas(canvas, fullUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });

      const qrDataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(qrDataUrl);
      onQRGenerated?.(qrDataUrl);

      // Şimdi tasarımlı kartı oluştur
      await generateDesignedCard(cardCanvas, qrDataUrl);
    } catch (error) {
      console.error("QR kod oluşturma hatası:", error);
    }
  };

  const generateDesignedCard = async (
    cardCanvas: HTMLCanvasElement,
    qrDataUrl: string
  ) => {
    const ctx = cardCanvas.getContext("2d");
    if (!ctx) return;

    // Kart boyutları - kare format, sıkışık tasarım
    const cardSize = 320; // Kare boyut
    cardCanvas.width = cardSize;
    cardCanvas.height = cardSize;

    // Detay kart tarzı arka plan - gradient gölge efekti
    const gradient = ctx.createLinearGradient(0, 0, cardSize, cardSize);
    gradient.addColorStop(0, "#f8fafc"); // slate-50
    gradient.addColorStop(1, "#e2e8f0"); // slate-200
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cardSize, cardSize);

    // İnce border
    ctx.strokeStyle = "#cbd5e1"; // slate-300
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cardSize, cardSize);

    // İç gölge efekti
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // QR kod alanı - merkezi, daha büyük
    const qrImg = new Image();
    qrImg.onload = () => {
      const qrSize = 240; // Daha büyük QR
      const qrX = (cardSize - qrSize) / 2;
      const qrY = 25; // Üstten daha az boşluk

      // QR kod arka planı - beyaz kare
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

      // QR kod border
      ctx.strokeStyle = "#e2e8f0"; // slate-200
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

      // QR kod
      ctx.shadowColor = "transparent"; // Gölgeyi kapat
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Alt metin alanı - kompakt
      const textY = qrY + qrSize + 20;

      // Ana mesaj
      ctx.fillStyle = "#475569"; // slate-600
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Acil durumlar için QR kodu tarayın", cardSize / 2, textY);

      // Site bilgisi
      ctx.fillStyle = "#64748b"; // slate-500
      ctx.font = "12px Arial";
      ctx.fillText("tag.asnus.com", cardSize / 2, textY + 20);

      // Önizleme canvas'ını güncelle
      const previewCanvas = previewCanvasRef.current;
      if (previewCanvas) {
        const previewCtx = previewCanvas.getContext("2d");
        if (previewCtx) {
          previewCanvas.width = cardCanvas.width;
          previewCanvas.height = cardCanvas.height;
          previewCtx.drawImage(cardCanvas, 0, 0);
          setCardReady(true);
        }
      }
    };
    qrImg.src = qrDataUrl;
  };

  const downloadDesignedCard = () => {
    const cardCanvas = cardCanvasRef.current;
    if (!cardCanvas) return;

    const link = document.createElement("a");
    link.href = cardCanvas.toDataURL("image/png");
    link.download = `${userTag.personalInfo.name.replace(
      /\s+/g,
      "-"
    )}-motosiklet-tag-kart.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSimpleQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${userTag.personalInfo.name.replace(
      /\s+/g,
      "-"
    )}-qr-kod.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Gizli canvas'lar */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={cardCanvasRef} style={{ display: "none" }} />

      {/* Önizleme */}
      <div className="text-center mb-4">
        <div className="bg-white p-2 rounded-xl inline-block">
          <canvas
            ref={previewCanvasRef}
            className="max-w-[200px] w-full h-auto rounded-lg"
            style={{ display: cardReady ? "block" : "none" }}
          />
          {!cardReady && (
            <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                Kart Oluşturuluyor...
              </span>
            </div>
          )}
        </div>
        <div className="text-sm text-slate-400 mt-2">
          <p>Sade QR kartınızın önizlemesi</p>
        </div>
      </div>

      {/* İndirme butonları */}
      <div className="space-y-3">
        <button
          onClick={downloadDesignedCard}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Kart İndir
        </button>

        <button
          onClick={downloadSimpleQR}
          className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Sadece QR İndir
        </button>
      </div>
    </div>
  );
}
