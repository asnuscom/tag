"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { themes } from "@/config/themes";
import { canUserCreateTag } from "@/services/userService";
import { createTag } from "@/services/tagService";
import { User, Tag } from "@/types/user";
import { getMotorcycleImage } from "@/utils/motorcycle-images";
import MotorcycleLogo from "./MotorcycleLogo";

interface CreateTagFormProps {
  onSuccess: (tag: Tag) => void;
  onError: (error: string) => void;
}

export default function CreateTagForm({
  onSuccess,
  onError,
}: CreateTagFormProps) {
  const { user } = useAuth();
  const { currentUser, userLoading, isPremium } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const [limitMessage, setLimitMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    // Tag bilgileri
    tagName: "",
    
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

  // Tag oluşturma limitini kontrol et
  useEffect(() => {
    const checkTagLimit = async () => {
      if (!currentUser) {
        setCanCreate(false);
        setLimitMessage('Kullanıcı bilgileri yükleniyor...');
        return;
      }
      
      try {
        const canCreateResult = await canUserCreateTag(currentUser.id);
        setCanCreate(canCreateResult.canCreate);
        setLimitMessage(canCreateResult.reason || '');
      } catch (error) {
        console.error("Tag limit kontrolü hatası:", error);
        setCanCreate(false);
        setLimitMessage('Tag limit kontrolünde hata oluştu.');
      }
    };

    checkTagLimit();
  }, [currentUser]);

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
    if (!formData.tagName.trim()) return "Tag adı zorunludur";
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

    // reCAPTCHA kontrolü (sadece production'da)
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment) {
      const recaptchaToken = recaptchaRef.current?.getValue();
      if (!recaptchaToken) {
        onError("Lütfen reCAPTCHA'yı tamamlayın");
        return;
      }
    }

    // Kullanıcı verileri yüklenme kontrolü
    if (userLoading) {
      onError("Kullanıcı verileri henüz yükleniyor, lütfen bekleyin...");
      return;
    }

    setIsLoading(true);

    try {
      // Auth kontrolü
      if (!user) {
        onError("Lütfen önce giriş yapın.");
        return;
      }

      // Kullanıcı verisi kontrolü
      if (!currentUser || !currentUser.id) {
        onError("Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyin.");
        return;
      }

      // Limit kontrolü
      if (!canCreate) {
        onError(limitMessage || 'Tag oluşturma limitinize ulaştınız.');
        return;
      }

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
          brand: motorcycleBrands.find(x => x.value === formData.motorcycleBrand)?.value,
          model: formData.motorcycleModel,
          plate: formData.plate,
          image: getMotorcycleImage(formData.motorcycleBrand),
        },
        emergency: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
        },
        theme: formData.motorcycleBrand as Tag['theme'],
        note: formData.note
      };

      // Tag'ı oluştur (Firestore kullanıcı ID'sini kullan)
      const newTag = await createTag(currentUser.id, tagData);

      // Başarı callback'ini çağır
      onSuccess(newTag);

      // Formu temizle
      setFormData({
        tagName: "",
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
      
      // Kullanıcı durumunu yeniden kontrol et
      
    } catch (error: any) {
      console.error("Tag oluşturma hatası:", error);
      onError(error.message || "Tag oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTheme = themes[formData.motorcycleBrand as keyof typeof themes];

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Yeni Tag Oluşturun
        </h2>
        <p className="text-slate-300">
          Motosikletiniz için yeni bir dijital iletişim kartı oluşturun
        </p>
        
        {/* Kullanıcı Durumu */}
        {currentUser && (
          <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Sahip olduğunuz tag sayısı:</span>
              <span className="text-white font-medium">
                {currentUser.tags?.length || 0} / {isPremium ? '∞' : currentUser.maxTags}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-400">Üyelik:</span>
              <span className={`font-medium ${
                isPremium 
                  ? 'text-yellow-400' 
                  : 'text-slate-400'
              }`}>
                {isPremium ? 'Premium' : 'Ücretsiz'}
              </span>
            </div>
            {!canCreate && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                {limitMessage}
                {!isPremium && (
                  <div className="mt-2">
                    <Link 
                      href="/premium" 
                      className="text-yellow-400 hover:text-yellow-300 underline"
                    >
                      Premium'a Geçin
                    </Link>
                    {' '}ve sınırsız tag oluşturun!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kişisel Tag, İş Tag, vb."
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Bu isim sadece kendi taglarınızı ayırt etmeniz için kullanılır
            </p>
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
              <MotorcycleLogo
                brand={formData.motorcycleBrand}
                size="lg"
                variant="preview"
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

        {/* reCAPTCHA - Sadece production'da göster */}
        {process.env.NODE_ENV !== 'development' && (
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              theme="dark"
            />
          </div>
        )}
        
        {/* Development uyarısı */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <p className="text-yellow-400 text-sm">
              🔧 Development Modu: reCAPTCHA devre dışı
            </p>
          </div>
        )}

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
          disabled={isLoading || !canCreate}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: (isLoading || !canCreate)
              ? undefined
              : `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`,
          }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Tag Oluşturuluyor...
            </>
          ) : !canCreate ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {currentUser?.isPremium ? 'Bir hata oluştu' : 'Premium Gerekli'}
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