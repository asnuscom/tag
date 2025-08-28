"use client";

import React from "react";
import { Tag } from "@/types/user";
import { themes } from "@/config/themes";
import MotorcycleLogo from "./MotorcycleLogo";

interface TagDisplayProps {
  tag: Tag;
}

export default function TagDisplay({ tag }: TagDisplayProps) {
  const selectedTheme = themes[tag.theme] || themes.generic;

  return (
    <div 
      className="min-h-screen text-white p-4"
      style={{
        background: selectedTheme.gradients.background
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MotorcycleLogo brand={tag.theme} size={60} />
          </div>
          <h1 className="text-2xl font-bold mb-2">{tag.name}</h1>
          <div className="flex items-center justify-center gap-2 text-sm opacity-75">
            <span>{tag.motorcycle.brand.toUpperCase()}</span>
            <span>•</span>
            <span>{tag.motorcycle.model}</span>
          </div>
        </div>

        {/* Ana Kart */}
        <div 
          className="rounded-2xl p-6 mb-6 border"
          style={{
            background: `linear-gradient(135deg, ${selectedTheme.colors.surface} 0%, ${selectedTheme.colors.background} 100%)`,
            borderColor: selectedTheme.colors.primary + '40'
          }}
        >
          {/* Kişisel Bilgiler */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: selectedTheme.colors.primary + '20' }}
              >
                <svg className="w-5 h-5" style={{ color: selectedTheme.colors.primary }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{tag.personalInfo.name}</h3>
                <p className="text-sm opacity-75">Sürücü</p>
              </div>
            </div>

            {tag.personalInfo.phone && (
              <a 
                href={`tel:${tag.personalInfo.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/10"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedTheme.colors.accent + '20' }}
                >
                  <svg className="w-4 h-4" style={{ color: selectedTheme.colors.accent }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <span>{tag.personalInfo.phone}</span>
              </a>
            )}

            {tag.personalInfo.email && (
              <a 
                href={`mailto:${tag.personalInfo.email}`}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/10"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedTheme.colors.secondary + '20' }}
                >
                  <svg className="w-4 h-4" style={{ color: selectedTheme.colors.secondary }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span>{tag.personalInfo.email}</span>
              </a>
            )}

            {tag.personalInfo.instagram && (
              <a 
                href={`https://instagram.com/${tag.personalInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-black/10"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E4405F20' }}
                >
                  <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span>{tag.personalInfo.instagram}</span>
              </a>
            )}
          </div>

          {/* Motosiklet Bilgileri */}
          <div className="border-t pt-4 mb-6" style={{ borderColor: selectedTheme.colors.primary + '20' }}>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: selectedTheme.colors.primary }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.72 2.03c.86.43 1.43 1.32 1.43 2.32 0 .79-.36 1.49-.92 1.96L10.5 5.5c-.55 0-1-.45-1-1s.45-1 1-1h2.22zM20.5 14c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM3.5 14C1.57 14 0 15.57 0 17.5S1.57 21 3.5 21 7 19.43 7 17.5 5.43 14 3.5 14zm0 5C2.67 19 2 18.33 2 17.5S2.67 16 3.5 16 5 16.67 5 17.5 4.33 19 3.5 19zm11-6.5h-2.82l1.59-1.59c.37-.37.37-.96 0-1.33l-1.33-1.33c-.37-.37-.96-.37-1.33 0L8.73 10.1c-.37.37-.37.96 0 1.33l1.33 1.33c.37.37.96.37 1.33 0L13 11.5h1.5c.83 0 1.5.67 1.5 1.5v2h2v-2c0-1.93-1.57-3.5-3.5-3.5z"/>
              </svg>
              Motosiklet
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-75">Marka</p>
                <p className="font-medium">{tag.motorcycle.brand.toUpperCase()}</p>
              </div>
              <div>
                <p className="opacity-75">Model</p>
                <p className="font-medium">{tag.motorcycle.model}</p>
              </div>
              <div className="col-span-2">
                <p className="opacity-75">Plaka</p>
                <p className="font-medium text-lg" style={{ color: selectedTheme.colors.accent }}>
                  {tag.motorcycle.plate}
                </p>
              </div>
            </div>
          </div>

          {/* Acil Durum */}
          <div className="border-t pt-4" style={{ borderColor: selectedTheme.colors.primary + '20' }}>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Acil Durum
            </h4>
            <div className="space-y-2">
              <div>
                <p className="opacity-75 text-sm">Aranacak Kişi</p>
                <p className="font-medium">{tag.emergency.name}</p>
              </div>
              <a 
                href={`tel:${tag.emergency.phone}`}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                {tag.emergency.phone}
              </a>
            </div>
          </div>

          {/* Kan Grubu */}
          {tag.personalInfo.bloodType && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: selectedTheme.colors.primary + '20' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-75">Kan Grubu</span>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: selectedTheme.colors.accent + '20',
                    color: selectedTheme.colors.accent
                  }}
                >
                  {tag.personalInfo.bloodType}
                </span>
              </div>
            </div>
          )}

          {/* Not */}
          {tag.note && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: selectedTheme.colors.primary + '20' }}>
              <h4 className="font-semibold mb-2">Not</h4>
              <p className="text-sm opacity-90">{tag.note}</p>
            </div>
          )}
        </div>

        {/* Alt Bilgi */}
        <div className="text-center text-sm opacity-75">
          <p>Powered by Asnus Tag System</p>
        </div>
      </div>
    </div>
  );
}