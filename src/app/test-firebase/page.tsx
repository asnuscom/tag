"use client";

import { useState } from "react";
import { database } from "@/config/firebase";
import { ref, push, set } from "firebase/database";

export default function TestFirebasePage() {
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const testFirebaseConnection = async () => {
    setStatus("Firebase bağlantısı test ediliyor...");
    setError("");

    try {
      // Basit bir test verisi
      const testData = {
        test: true,
        timestamp: Date.now(),
        message: "Firebase bağlantı testi",
      };

      const testRef = ref(database, "test");
      const newTestRef = push(testRef);
      await set(newTestRef, testData);

      setStatus("✅ Firebase bağlantısı başarılı!");
      console.log("Firebase test başarılı:", newTestRef.key);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(`❌ Firebase hatası: ${errorMessage}`);
      console.error("Firebase test hatası:", err);

      // Detaylı hata bilgisi
      if (err && typeof err === "object" && "code" in err) {
        setError(
          (prev) => prev + `\nHata Kodu: ${(err as { code: string }).code}`
        );
      }

      // 400 hatası özel durumu
      if (errorMessage.includes("400") || errorMessage.includes("Index")) {
        setError(
          (prev) =>
            prev +
            `\n\n🔧 Çözüm: Firebase Console > Realtime Database > Rules&apos;da index ekleyin:`
        );
        setError((prev) => prev + `\n".indexOn": "uniqueUrl"`);
      }
    }
  };

  const testUserCreation = async () => {
    setStatus("Kullanıcı oluşturma test ediliyor...");
    setError("");

    try {
      const userData = {
        personalInfo: {
          name: "Test Kullanıcı",
          phone: "05XX XXX XX XX",
          email: "test@example.com",
          instagram: "test_user",
          bloodType: "A+",
        },
        motorcycle: {
          brand: "Honda",
          model: "CB250R",
          plate: "34 TEST 123",
          image: "/assets/motorcycles/honda-cb250r.png",
        },
        emergency: {
          name: "Test Acil Kişi",
          phone: "05XX XXX XX XX",
        },
        theme: "honda",
        tag: "TEST",
        note: "Bu bir test kullanıcısıdır",
        uniqueUrl: `test-${Date.now()}`,
        qrCodeUrl: "test-qr-url",
        isPremium: false,
        showAds: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const usersRef = ref(database, "users");
      const newUserRef = push(usersRef);
      await set(newUserRef, userData);

      setStatus("✅ Kullanıcı oluşturma başarılı!");
      console.log("Kullanıcı test başarılı:", newUserRef.key);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(`❌ Kullanıcı oluşturma hatası: ${errorMessage}`);
      console.error("Kullanıcı test hatası:", err);

      if (err && typeof err === "object" && "code" in err) {
        setError(
          (prev) => prev + `\nHata Kodu: ${(err as { code: string }).code}`
        );
      }

      // Index hatası kontrolü
      if (
        errorMessage.includes("Index not defined") ||
        errorMessage.includes("uniqueUrl")
      ) {
        setError(
          (prev) =>
            prev +
            `\n\n🔧 ÇÖZÜM: Firebase Console&apos;da şu adımları takip edin:`
        );
        setError(
          (prev) => prev + `\n1. Realtime Database > Rules sekmesine gidin`
        );
        setError((prev) => prev + `\n2. Aşağıdaki kuralları ekleyin:`);
        setError(
          (prev) =>
            prev +
            `\n{\n  "rules": {\n    "users": {\n      ".read": true,\n      ".write": true,\n      ".indexOn": "uniqueUrl"\n    }\n  }\n}`
        );
      }
    }
  };

  const checkConfig = () => {
    setStatus("Firebase konfigürasyon kontrol ediliyor...");

    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        ? "✅ Mevcut"
        : "❌ Eksik",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        ? "✅ Mevcut"
        : "❌ Eksik",
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
        ? "✅ Mevcut"
        : "❌ Eksik",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        ? "✅ Mevcut"
        : "❌ Eksik",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Mevcut" : "❌ Eksik",
    };

    setStatus(`Firebase Konfigürasyon:
API Key: ${config.apiKey}
Auth Domain: ${config.authDomain}
Database URL: ${config.databaseURL}
Project ID: ${config.projectId}
App ID: ${config.appId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Test Sayfası</h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={checkConfig}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Konfigürasyon Kontrol Et
          </button>

          <button
            onClick={testFirebaseConnection}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Firebase Bağlantısını Test Et
          </button>

          <button
            onClick={testUserCreation}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Kullanıcı Oluşturmayı Test Et
          </button>
        </div>

        {status && (
          <div className="bg-slate-800 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Durum:</h3>
            <pre className="whitespace-pre-wrap text-sm">{status}</pre>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-300">Hata:</h3>
            <pre className="whitespace-pre-wrap text-sm text-red-200">
              {error}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-slate-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            Yaygın 400 Hataları ve Çözümleri:
          </h3>
          <ul className="text-sm space-y-2">
            <li>
              • <strong>Invalid API Key:</strong> Environment
              variables&apos;ları kontrol edin
            </li>
            <li>
              • <strong>Database URL missing:</strong>{" "}
              NEXT_PUBLIC_FIREBASE_DATABASE_URL ekleyin
            </li>
            <li>
              • <strong>Permission denied:</strong> Database rules&apos;ları
              kontrol edin
            </li>
            <li>
              • <strong>Invalid project:</strong> Project ID&apos;yi kontrol edin
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
