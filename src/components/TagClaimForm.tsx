"use client";

import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { claimTag } from "@/services/tagService";
import { themes } from "@/config/themes";
import { Tag } from "@/types/user";
import { getMotorcycleImage } from "@/utils/motorcycle-images";
import MotorcycleLogo from "./MotorcycleLogo";

interface TagClaimFormProps {
  tag: Tag;
  onSuccess: (claimedTag: Tag) => void;
  onCancel: () => void;
}

export default function TagClaimForm({ tag, onSuccess, onCancel }: TagClaimFormProps) {
  const { user } = useAuth();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    // Tag bilgileri
    tagName: "",
    
    // Kişisel bilgiler
    name: "",
    phone: "",
    email: user?.email || "",
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
    { value: "cfmoto", label: "CFMOTO" },
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
    if (!formData.tagName.trim()) return "Tag adı gerekli";
    if (!formData.name.trim()) return "Adınız gerekli";
    if (!formData.phone.trim()) return "Telefon numarası gerekli";
    if (!formData.email.trim()) return "E-posta adresi gerekli";
    if (!formData.motorcycleBrand) return "Motosiklet markası seçimi gerekli";
    if (!formData.motorcycleModel.trim()) return "Motosiklet modeli gerekli";
    if (!formData.plate.trim()) return "Plaka bilgisi gerekli";
    if (!formData.emergencyName.trim()) return "Acil durumda aranacak kişi adı gerekli";
    if (!formData.emergencyPhone.trim()) return "Acil durumda aranacak telefon gerekli";
    if (!formData.acceptTerms) return "Kullanım şartlarını kabul etmelisiniz";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // reCAPTCHA kontrolü
    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      setError("Lütfen reCAPTCHA'yı tamamlayın");
      return;
    }

    if (!user || !currentUser || !currentUser.id) {
      setError("Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Tag verilerini hazırla
      const tagData = {
        name: formData.tagName,
        personalInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          instagram: formData.instagram,
          bloodType: formData.bloodType,
        },
        motorcycle: {
          brand: formData.motorcycleBrand,
          model: formData.motorcycleModel,
          plate: formData.plate,
          image: getMotorcycleImage(formData.motorcycleBrand),
        },
        emergency: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
        },
        theme: formData.motorcycleBrand as Tag['theme'],
        note: formData.note,
      };

      // Tag'ı sahiplen
      const claimedTag = await claimTag(tag.id, currentUser.id, tagData);

      // Başarı callback'ini çağır
      onSuccess(claimedTag);

      // ReCAPTCHA'yı sıfırla
      recaptchaRef.current?.reset();
      
    } catch (error: any) {
      console.error("Tag sahiplendirme hatası:", error);
      setError(error.message || "Tag sahiplendirilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTheme = themes[formData.motorcycleBrand as keyof typeof themes];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Tag'ı Sahiplenin</h1>
          <p className="text-slate-300">
            Bu tag'ı kendinize özelleştirin ve aktif hale getirin
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tag Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                Tag Bilgileri
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tag Adı *
                </label>
                <input
                  type="text"
                  name="tagName"
                  value={formData.tagName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Benim Tag'im"
                />
              </div>
            </div>

            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                Kişisel Bilgiler
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Adınız *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adınız Soyadınız"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+90 555 123 45 67"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ornek@email.com"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Motosiklet Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2 flex items-center gap-2">
                Motosiklet Bilgileri
                <MotorcycleLogo brand={formData.motorcycleBrand} size={20} />
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Marka *
                  </label>
                  <select
                    name="motorcycleBrand"
                    value={formData.motorcycleBrand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      background: selectedTheme 
                        ? `linear-gradient(135deg, ${selectedTheme.colors.background} 0%, ${selectedTheme.colors.surface} 100%)` 
                        : undefined
                    }}
                  >
                    {motorcycleBrands.map(brand => (
                      <option key={brand.value} value={brand.value}>{brand.label}</option>
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CBR 600RR"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="34 ABC 123"
                  />
                </div>
              </div>
            </div>

            {/* Acil Durum */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                Acil Durum İletişimi
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Acil Durumda Aranacak Kişi *
                  </label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Acil iletişim kişisi adı"
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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+90 555 987 65 43"
                  />
                </div>
              </div>
            </div>

            {/* Not */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Not (İsteğe Bağlı)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ek bilgiler veya notlarınız..."
              />
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                theme="dark"
              />
            </div>

            {/* Şartlar */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-slate-300">
                Kullanım şartlarını ve gizlilik politikasını okudum ve kabul ediyorum. *
              </label>
            </div>

            {/* Butonlar */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )}
                {isLoading ? 'Sahiplendiriliyor...' : 'Tag\'ı Sahiplen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}