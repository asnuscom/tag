"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { getAllUsers, deleteUser, updateMembershipStatus } from "@/services/userService";
import * as tagService from "@/services/tagService";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MotorcycleLogo from "@/components/MotorcycleLogo";

export default function AdminUsersPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, userLoading, isAdmin } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "tagCount">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterPremium, setFilterPremium] = useState<"all" | "premium" | "free">("all");
  const router = useRouter();

  // Admin kontrolü ve kullanıcıları yükleme
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
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Kullanıcılar yüklenirken hata:", err);
      setError("Kullanıcılar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error("Kullanıcı silinirken hata:", err);
      setError("Kullanıcı silinirken bir hata oluştu.");
    }
  };

  const handleTogglePremium = async (userId: string, isPremium: boolean) => {
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


  // Filtreleme ve sıralama
  const filteredAndSortedUsers = users
    .filter(user => {
      // Arama filtresi
      const matchesSearch = 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.tags.some(tag => 
          tag.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.motorcycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.motorcycle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.motorcycle.plate.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Durum filtresi
      let matchesStatus = true;
      if (filterStatus === "active") matchesStatus = user.tags.some(tag => tag.isActive);
      if (filterStatus === "inactive") matchesStatus = !user.tags.some(tag => tag.isActive);
      
      // Premium filtresi
      let matchesPremium = true;
      if (filterPremium === "premium") matchesPremium = user.isPremium === true;
      if (filterPremium === "free") matchesPremium = user.isPremium === false;
      
      return matchesSearch && matchesStatus && matchesPremium;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = (a.displayName || a.email).toLowerCase();
          bValue = (b.displayName || b.email).toLowerCase();
          break;
        case "createdAt":
          aValue = a.createdAt?.getTime() || 0;
          bValue = b.createdAt?.getTime() || 0;
          break;
        case "tagCount":
          aValue = a.tags.length;
          bValue = b.tags.length;
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
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            <h1 className="text-3xl font-bold mb-2">Kullanıcı Yönetimi</h1>
            <p className="text-slate-300">
              Toplam {filteredAndSortedUsers.length} / {users.length} kullanıcı
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
              href="/dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              Dashboard
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
                placeholder="Ad, e-posta, marka, model veya plaka ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Sadece Aktif</option>
              <option value="inactive">Sadece Pasif</option>
            </select>
            
            <select
              value={filterPremium}
              onChange={(e) => setFilterPremium(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Üyelikler</option>
              <option value="premium">Sadece Premium</option>
              <option value="free">Sadece Ücretsiz</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Kayıt Tarihine Göre</option>
              <option value="name">İsme Göre</option>
              <option value="tagCount">Tag Sayısına Göre</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {sortOrder === "asc" ? "↑ Artan" : "↓ Azalan"}
            </button>
          </div>
        </div>

        {/* İstatistik Özeti */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/30 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Toplam</p>
            <p className="text-xl font-semibold">{users.length}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-sm">Aktif</p>
            <p className="text-xl font-semibold text-green-400">
              {users.filter(u => u.tags.some(tag => tag.isActive)).length}
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">Premium</p>
            <p className="text-xl font-semibold text-yellow-400">
              {users.filter(u => u.isPremium).length}
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">Filtrelenmiş</p>
            <p className="text-xl font-semibold text-blue-400">
              {filteredAndSortedUsers.length}
            </p>
          </div>
        </div>

        {/* Kullanıcı Listesi */}
        <div className="grid gap-4">
          {filteredAndSortedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {user.displayName || user.email}
                      </h3>
                      <p className="text-slate-400">
                        {user.tags.length} Tag • {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-slate-400 text-sm">E-posta:</span>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Tag Sayısı:</span>
                      <p className="text-white">{user.tags.length} / {user.maxTags}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Aktif Tag:</span>
                      <p className="text-white">{user.tags.filter(tag => tag.isActive).length}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Kayıt:</span>
                      <p className="text-white">
                        {user.createdAt?.toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>

                  {/* Tag listesi */}
                  {user.tags.length > 0 && (
                    <div className="mb-4">
                      <span className="text-slate-400 text-sm mb-2 block">Tag&apos;ler:</span>
                      <div className="space-y-2">
                        {user.tags.slice(0, 3).map((tag) => (
                          <div key={tag.id} className="bg-slate-700/30 rounded p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <MotorcycleLogo
                                  brand={tag.motorcycle.brand}
                                  size="sm"
                                  variant="dashboard"
                                />
                                <div>
                                  <p className="text-white font-medium">{tag.name}</p>
                                  <p className="text-slate-400 text-sm">
                                    {tag.motorcycle.brand} {tag.motorcycle.model} - {tag.motorcycle.plate}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  tag.isActive
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}>
                                  {tag.isActive ? "Aktif" : "Pasif"}
                                </span>
                                <Link
                                  href={`/${tag.uniqueUrl}`}
                                  target="_blank"
                                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                                >
                                  Görüntüle
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                        {user.tags.length > 3 && (
                          <p className="text-slate-400 text-sm text-center">
                            +{user.tags.length - 3} tag daha
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Durum Badgeleri */}
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.tags.some(tag => tag.isActive)
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {user.tags.some(tag => tag.isActive) ? "Aktif Tag&apos;li" : "Aktif Tag Yok"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isPremium
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                      }`}
                    >
                      {user.isPremium ? "Premium" : "Ücretsiz"}
                    </span>
                    {user.showAds && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        Reklamlı
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {user.tags.length} Tag
                    </span>
                  </div>
                </div>

                {/* Eylem Butonları */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePremium(user.id, user.isPremium || false)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                      user.isPremium
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {user.isPremium ? "Premium İptal" : "Premium Yap"}
                  </button>
                  <Link
                    href="/admin/tags"
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium text-center transition-colors duration-200"
                  >
                    Tag&apos;leri Gör
                  </Link>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors duration-200"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg mb-2">
              {searchTerm || filterStatus !== "all" || filterPremium !== "all" 
                ? "Filtrelere uygun kullanıcı bulunamadı." 
                : "Henüz kayıtlı kullanıcı yok."
              }
            </p>
            {(searchTerm || filterStatus !== "all" || filterPremium !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterPremium("all");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
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