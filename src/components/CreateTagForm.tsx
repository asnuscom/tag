"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/contexts/AuthContext";
import { themes } from "@/config/themes";
import { createUser } from "@/services/firebase";
import { User } from "@/types/user";
import { getMotorcycleImage } from "@/utils/motorcycle-images";

interface CreateTagFormProps {
  onSuccess: (
    uniqueUrl: string,
    qrCodeUrl: string,
    userInfo: {
      name: string;
      motorcycleBrand: string;
      motorcycleModel: string;
      motorcycleImage: string;
    }
  ) => void;
  onError: (error: string) => void;
}

export default function CreateTagForm({
  onSuccess,
  onError,
}: CreateTagFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Kişisel bilgiler
    name: "",
    phone: "",
    email: "",
    instagram: "",
    bloodType: "A+",

    // Motosiklet bilgileri
    motorcycleBrand: "honda",
    motorcycleModel: "",
    plate: "",

    // Acil durum
    emergencyName: "",
    emergencyPhone: "",

    // Diğer
    note: "",
    acceptTerms: false,
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const motorcycleBrands = [
    { value: "honda", label: "Honda" },
    { value: "yamaha", label: "Yamaha" },
    { value: "kawasaki", label: "Kawasaki" },
    { value: "suzuki", label: "Suzuki" },
    { value: "bmw", label: "BMW" },
    { value: "ktm", label: "KTM" },
    { value: "ducati", label: "Ducati" },
    { value: "aprilia", label: "Aprilia" },
    { value: "harley", label: "Harley-Davidson" },
    { value: "triumph", label: "Triumph" },
    { value: "husqvarna", label: "Husqvarna" },
    { value: "cfmoto", label: "CFMoto" },
    { value: "benelli", label: "Benelli" },
    { value: "moto_guzzi", label: "Moto Guzzi" },
    { value: "mv_agusta", label: "MV Agusta" },
    { value: "indian", label: "Indian" },
    { value: "royal_enfield", label: "Royal Enfield" },
    { value: "jawa", label: "Jawa" },
    { value: "rks", label: "RKS" },
    { value: "bajaj", label: "Bajaj" },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "İsim alanı zorunludur";
    if (!formData.phone.trim()) return "Telefon alanı zorunludur";
    if (!formData.email.trim()) return "E-posta alanı zorunludur";
    if (!formData.motorcycleModel.trim()) return "Motosiklet modeli zorunludur";
    if (!formData.plate.trim()) return "Plaka alanı zorunludur";
    if (!formData.emergencyName.trim())
      return "Acil durum kişisi adı zorunludur";
    if (!formData.emergencyPhone.trim())
      return "Acil durum telefonu zorunludur";
    if (!formData.acceptTerms) return "Kullanım şartlarını kabul etmelisiniz";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      onError(validationError);
      return;
    }

    // reCAPTCHA kontrolü
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      onError("Lütfen reCAPTCHA&apos;yı tamamlayın");
      return;
    }

    setIsLoading(true);

    try {
      // Auth kontrolü
      if (!user) {
        onError("Lütfen önce giriş yapın.");
        return;
      }

      // Kullanıcı verilerini hazırla
      const userData = {
        authUid: user.uid, // Firebase Auth UID'si ekle
        personalInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          instagram: formData.instagram,
          bloodType: formData.bloodType,
        },
        motorcycle: {
          brand:
            motorcycleBrands.find((b) => b.value === formData.motorcycleBrand)
              ?.label || "Honda",
          model: formData.motorcycleModel,
          plate: formData.plate,
          image: getMotorcycleImage(formData.motorcycleBrand),
        },
        emergency: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
        },
        theme: formData.motorcycleBrand as User["theme"],
        tag: "USER",
        note: formData.note,
        isPremium: false as boolean,
        showAds: true as boolean,
      };

      // Kullanıcıyı oluştur
      const result = await createUser(userData);

      // Başarı callback&apos;ini çağır
      onSuccess(result.uniqueUrl, result.qrCodeUrl, {
        name: formData.name,
        motorcycleBrand:
          motorcycleBrands.find((b) => b.value === formData.motorcycleBrand)
            ?.label || "Honda",
        motorcycleModel: formData.motorcycleModel,
        motorcycleImage: getMotorcycleImage(formData.motorcycleBrand),
      });

      // Formu temizle
      setFormData({
        name: "",
        phone: "",
        email: "",
        instagram: "",
        bloodType: "A+",
        motorcycleBrand: "honda",
        motorcycleModel: "",
        plate: "",
        emergencyName: "",
        emergencyPhone: "",
        note: "",
        acceptTerms: false,
      });

      recaptchaRef.current?.reset();
    } catch (error) {
      console.error("Tag oluşturma hatası:", error);
      onError("Tag oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTheme = themes[formData.motorcycleBrand as keyof typeof themes];

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Kendi Tag&apos;inizi Oluşturun
        </h2>
        <p className="text-slate-300">
          Motosikletiniz için özel tasarlanmış dijital iletişim kartınızı
          oluşturun
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kişisel Bilgiler */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
            Kişisel Bilgiler
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adınız ve soyadınız"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+90 555 123 45 67"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                E-posta *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="@kullaniciadi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Kan Grubu
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Motosiklet Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
            Motosiklet Bilgileri
          </h3>

          {/* Motosiklet Görseli Önizleme */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src={getMotorcycleImage(formData.motorcycleBrand)}
                alt={`${formData.motorcycleBrand} motosiklet`}
                width={128}
                height={128}
                className="w-32 h-32 object-contain rounded-lg border-2 border-slate-600 bg-slate-700/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    getMotorcycleImage("honda");
                }}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 border border-slate-600">
                {
                  motorcycleBrands.find(
                    (b) => b.value === formData.motorcycleBrand
                  )?.label
                }
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Marka *
              </label>
              <select
                name="motorcycleBrand"
                value={formData.motorcycleBrand}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  borderColor: `${selectedTheme.colors.primary}40`,
                }}
              >
                {motorcycleBrands.map((brand) => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="motorcycleModel"
                value={formData.motorcycleModel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CB650R, R25, Ninja 250 vb."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Plaka *
              </label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="34 ABC 123"
                required
              />
            </div>
          </div>
        </div>

        {/* Acil Durum Bilgileri */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
            Acil Durum İletişim
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Acil Durum Kişisi *
              </label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yakın akraba veya arkadaş"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Acil Durum Telefonu *
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+90 555 123 45 67"
                required
              />
            </div>
          </div>
        </div>

        {/* Not */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Özel Not
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Özel durumlar, sağlık bilgileri vb. (isteğe bağlı)"
          />
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            theme="dark"
          />
        </div>

        {/* Şartlar ve Koşullar */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
            required
          />
          <label className="text-sm text-slate-300">
            <Link
              href="/terms"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Kullanım Şartları
            </Link>{" "}
            ve{" "}
            <Link
              href="/privacy"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Gizlilik Politikası
            </Link>
            &apos;nı okudum ve kabul ediyorum. *
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: isLoading
              ? undefined
              : `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`,
          }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Tag Oluşturuluyor...
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Tag Oluştur
            </>
          )}
        </button>
      </form>
    </div>
  );
}
