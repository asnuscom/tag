"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStore } from "@/store/userStore";
import { getAllUsers } from "@/services/userService";
import { getAllTags, getUnclaimedTags } from "@/services/tagService";
import { User, Tag } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPanel() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, userLoading, isAdmin } = useUserStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    todayRegistrations: 0,
    totalTags: 0,
    activeTags: 0,
    unclaimedTags: 0,
    todayUnclaimedTags: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Admin kontrolü ve stats yükleme
  useEffect(() => {
    if (!authLoading && !userLoading) {
      if (!authUser || !isAdmin) {
        router.push("/");
        return;
      }
      
      // Admin ise stats'ları yükle
      loadStats();
    }
  }, [authUser, authLoading, userLoading, isAdmin, router]);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Paralel olarak tüm veriyi çek
      const [users, allTags, unclaimedTags] = await Promise.all([
        getAllUsers(),
        getAllTags(),
        getUnclaimedTags()
      ]);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        premiumUsers: users.filter(u => u.isPremium).length,
        todayRegistrations: users.filter(u => {
          const createdDate = new Date(u.createdAt || 0);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        }).length,
        totalTags: allTags.length,
        activeTags: allTags.filter(t => t.isActive).length,
        unclaimedTags: unclaimedTags.length,
        todayUnclaimedTags: unclaimedTags.filter(t => {
          const createdDate = new Date(t.createdAt);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        }).length
      });
    } catch (err) {
      console.error("İstatistikler yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
            <p className="text-slate-300">
              Sistem yönetim ve kontrol paneli
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Premium Üye</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.premiumUsers}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Bugün Kayıt</p>
                <p className="text-2xl font-bold text-purple-400">{stats.todayRegistrations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Yönetim Alanları */}
        <div className="space-y-8">
          {/* Kullanıcı Yönetimi Alanı */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h2>
                  <p className="text-slate-400">Tüm kullanıcıları görüntüle, düzenle ve yönet</p>
                </div>
              </div>
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Kullanıcıları Yönet
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Toplam Kullanıcı</p>
                    <p className="text-lg font-semibold text-white">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Aktif Kullanıcı</p>
                    <p className="text-lg font-semibold text-green-400">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Premium Üye</p>
                    <p className="text-lg font-semibold text-yellow-400">{stats.premiumUsers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tag Yönetimi Alanı */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 11v8h8v-8H3zm2 2h4v4H5v-4zM3 3v8h8V3H3zm2 2h4v4H5V5zm8-2v8h8V3h-8zm2 2h4v4h-4V5zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Tag Yönetimi</h2>
                  <p className="text-slate-400">Tüm tagları görüntüle, durumlarını kontrol et</p>
                </div>
              </div>
              <Link
                href="/admin/tags"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Tagları Yönet
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Toplam Tag</p>
                    <p className="text-lg font-semibold text-white">{stats.totalTags}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Aktif Tag</p>
                    <p className="text-lg font-semibold text-blue-400">{stats.activeTags}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sahipsiz Tag Yönetimi Alanı */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Sahipsiz Tag Yönetimi</h2>
                  <p className="text-slate-400">Sahipsiz tagları oluştur ve yönet</p>
                </div>
              </div>
              <Link
                href="/admin/unclaimed"
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Sahipsiz Tagları Yönet
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Sahipsiz Tag</p>
                    <p className="text-lg font-semibold text-yellow-400">{stats.unclaimedTags}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Bugün Oluşturulan</p>
                    <p className="text-lg font-semibold text-orange-400">{stats.todayUnclaimedTags}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}