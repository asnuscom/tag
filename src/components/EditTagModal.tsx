"use client";

import { useState } from "react";

import { User } from "@/types/user";
import { updateUser } from "@/services/firebase";
import { getMotorcycleImage } from "@/utils/motorcycle-images";
import MotorcycleLogo from "./MotorcycleLogo";

interface EditTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTag: User;
  onSuccess: (updatedUser: User) => void;
  onError: (error: string) => void;
}

export default function EditTagModal({
  isOpen,
  onClose,
  userTag,
  onSuccess,
  onError,
}: EditTagModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Kişisel bilgiler
    name: userTag.personalInfo.name,
    phone: userTag.personalInfo.phone,
    email: userTag.personalInfo.email,
    instagram: userTag.personalInfo.instagram,
    bloodType: userTag.personalInfo.bloodType,

    // Motosiklet bilgileri
    motorcycleBrand: userTag.theme,
    motorcycleModel: userTag.motorcycle.model,
    plate: userTag.motorcycle.plate,

    // Acil durum
    emergencyName: userTag.emergency.name,
    emergencyPhone: userTag.emergency.phone,

    // Diğer
    note: userTag.note,
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

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      onError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Güncellenecek kullanıcı verilerini hazırla
      const updatedUserData = {
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
        note: formData.note,
      };

      // Kullanıcıyı güncelle
      await updateUser(userTag.id, updatedUserData);

      // Güncellenmiş kullanıcı nesnesini oluştur
      const updatedUser: User = {
        ...userTag,
        ...updatedUserData,
        updatedAt: new Date(),
      };

      onSuccess(updatedUser);
      onClose();
    } catch (error) {
      console.error("Tag güncelleme hatası:", error);
      onError("Tag güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-4xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Tag&apos;i Düzenle</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
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

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Güncelleniyor...
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
