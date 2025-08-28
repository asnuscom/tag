"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { getAllUsersWithTags, updateMembershipStatus } from "@/services/userService";
import { updateTagStatus } from "@/services/tagService";
import { User, Tag } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MotorcycleLogo from "@/components/MotorcycleLogo";

export default function AdminTagsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, userLoading, isAdmin } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "brand" | "owner">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterBrand, setFilterBrand] = useState<"all" | string>("all");
  const router = useRouter();

  // Admin kontrolü ve verileri yükleme
  useEffect(() => {
    if (!authLoading && !userLoading) {
      if (!authUser || !isAdmin) {
        router.push("/");
        return;
      }
      loadUsers();
    }
  }, [authUser, authLoading, userLoading, isAdmin, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsersWithTags();
      setUsers(allUsers);
    } catch (err) {
      console.error("Taglar yüklenirken hata:", err);
      setError("Taglar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTagStatus = async (tagId: string, isActive: boolean) => {
    try {
      await updateTagStatus(tagId, !isActive);
      setUsers(users.map(user => ({
        ...user,
        tags: user.tags.map(tag => 
          tag.id === tagId ? { ...tag, isActive: !isActive } : tag
        )
      })));
    } catch (err) {
      console.error("Tag durumu güncellenirken hata:", err);
      setError("Tag durumu güncellenirken bir hata oluştu.");
    }
  };

  const handleToggleUserPremium = async (userId: string, isPremium: boolean) => {
    try {
      const newMembership = isPremium ? 'standard' : 'premium';
      await updateMembershipStatus(userId, newMembership);
      setUsers(users.map(user => 
        user.id === userId ? { 
          ...user, 
          membership: newMembership,
          isPremium: newMembership === 'premium', 
          showAds: newMembership === 'standard' 
        } : user
      ));
    } catch (err) {
      console.error("Üyelik durumu güncellenirken hata:", err);
      setError("Üyelik durumu güncellenirken bir hata oluştu.");
    }
  };

  // Tüm tag'leri düz bir listede toplama
  const allTags = users.flatMap(user => 
    user.tags.map(tag => ({
      ...tag,
      ownerUser: user,
      ownerName: user.displayName || user.email
    }))
  );

  // Benzersiz marka listesi
  const uniqueBrands = Array.from(new Set(allTags.map(tag => tag.motorcycle.brand))).sort();

  // Filtreleme ve sıralama
  const filteredAndSortedTags = allTags
    .filter(tag => {
      // Arama filtresi
      const matchesSearch = 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.uniqueUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.motorcycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.motorcycle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.motorcycle.plate.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Durum filtresi
      let matchesStatus = true;
      if (filterStatus === "active") matchesStatus = tag.isActive === true;
      if (filterStatus === "inactive") matchesStatus = tag.isActive === false;
      
      // Marka filtresi
      let matchesBrand = true;
      if (filterBrand !== "all") matchesBrand = tag.motorcycle.brand === filterBrand;
      
      return matchesSearch && matchesStatus && matchesBrand;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "createdAt":
          aValue = a.createdAt?.getTime() || 0;
          bValue = b.createdAt?.getTime() || 0;
          break;
        case "brand":
          aValue = a.motorcycle.brand.toLowerCase();
          bValue = b.motorcycle.brand.toLowerCase();
          break;
        case "owner":
          aValue = a.ownerName.toLowerCase();
          bValue = b.ownerName.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (authLoading || userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!authUser || !isAdmin) {
    return null; // Router redirect will handle this
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tag Yönetimi</h1>
            <p className="text-slate-300">
              Toplam {filteredAndSortedTags.length} / {allTags.length} tag
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              ← Admin Paneli
            </Link>
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Kullanıcılar
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Filtreler */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Tag adı, sahip, marka, model veya plaka ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Sadece Aktif</option>
              <option value="inactive">Sadece Pasif</option>
            </select>
            
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tüm Markalar</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="createdAt">Oluşturma Tarihine Göre</option>
              <option value="name">Tag Adına Göre</option>
              <option value="brand">Markaya Göre</option>
              <option value="owner">Sahibine Göre</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              {sortOrder === "asc" ? "↑ Artan" : "↓ Azalan"}
            </button>
          </div>
        </div>

        {/* İstatistik Özeti */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/30 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Toplam Tag</p>
            <p className="text-xl font-semibold">{allTags.length}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-sm">Aktif Tag</p>
            <p className="text-xl font-semibold text-green-400">
              {allTags.filter(t => t.isActive).length}
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">Pasif Tag</p>
            <p className="text-xl font-semibold text-red-400">
              {allTags.filter(t => !t.isActive).length}
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">Filtrelenmiş</p>
            <p className="text-xl font-semibold text-blue-400">
              {filteredAndSortedTags.length}
            </p>
          </div>
        </div>

        {/* Marka Dağılımı */}
        <div className="bg-slate-800/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Marka Dağılımı</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueBrands.map(brand => (
              <div key={brand} className="flex items-center gap-2">
                <MotorcycleLogo brand={brand} size="xs" variant="dashboard" />
                <span className="text-sm text-slate-300">
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({allTags.filter(t => t.motorcycle.brand === brand).length})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tag Listesi - Kart Görünümü */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTags.map((tag) => (
            <div
              key={`${tag.ownerUser.id}-${tag.id}`}
              className={`bg-slate-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-200 hover:bg-slate-800/70 ${
                tag.isActive 
                  ? "border-slate-700 hover:border-green-500/30" 
                  : "border-red-500/30"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MotorcycleLogo
                    brand={tag.motorcycle.brand}
                    size="sm"
                    variant="dashboard"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {tag.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {tag.motorcycle.brand} {tag.motorcycle.model}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tag.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tag.isActive ? "Aktif" : "Pasif"}
                  </span>
                  {tag.ownerUser.isPremium && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Tag Bilgileri */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Sahip:</span>
                  <span className="text-xs text-white">{tag.personalInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Kullanıcı:</span>
                  <span className="text-xs text-slate-300">{tag.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Plaka:</span>
                  <span className="text-xs text-white">{tag.motorcycle.plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">URL:</span>
                  <Link
                    href={`/${tag.uniqueUrl}`}
                    target="_blank"
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    {tag.uniqueUrl}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Oluşturulma:</span>
                  <span className="text-xs text-white">
                    {tag.createdAt?.toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>

              {/* QR Kod Önizlemesi */}
              <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                <div className="w-16 h-16 bg-white rounded mx-auto flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 11v8h8v-8H3zm2 2h4v4H5v-4zM3 3v8h8V3H3zm2 2h4v4H5V5zm8-2v8h8V3h-8zm2 2h4v4h-4V5zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">QR Kod</p>
              </div>

              {/* Eylem Butonları */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => handleToggleTagStatus(tag.id, tag.isActive)}
                  className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors duration-200 ${
                    tag.isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {tag.isActive ? "Deaktif Et" : "Aktif Et"}
                </button>
                <Link
                  href={`/${tag.uniqueUrl}`}
                  target="_blank"
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium text-center transition-colors duration-200"
                >
                  Görüntüle
                </Link>
              </div>

              {/* Kullanıcı Premium Toggle */}
              <div>
                <button
                  onClick={() => handleToggleUserPremium(tag.ownerUser.id, tag.ownerUser.isPremium)}
                  className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors duration-200 ${
                    tag.ownerUser.isPremium
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-slate-600 hover:bg-slate-500 text-white"
                  }`}
                >
                  {tag.ownerUser.isPremium ? "Premium İptal Et" : "Sahibini Premium Yap"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedTags.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 11v8h8v-8H3zm2 2h4v4H5v-4zM3 3v8h8V3H3zm2 2h4v4H5V5zm8-2v8h8V3h-8zm2 2h4v4h-4V5zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg mb-2">
              {searchTerm || filterStatus !== "all" || filterBrand !== "all"
                ? "Filtrelere uygun tag bulunamadı." 
                : "Henüz oluşturulan tag yok."
              }
            </p>
            {(searchTerm || filterStatus !== "all" || filterBrand !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterBrand("all");
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}