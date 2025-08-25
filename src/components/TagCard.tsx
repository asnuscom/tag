"use client";

import { User } from "@/types/user";
import { ThemeConfig } from "@/config/themes";

import MotorcycleLogo from "./MotorcycleLogo";

interface TagCardProps {
  user: User;
  theme: ThemeConfig;
}

export default function TagCard({ user, theme }: TagCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${user.personalInfo.phone}`;
  };

  const handleWhatsApp = () => {
    const phoneNumber = user.personalInfo.phone
      .replace(/\s/g, "")
      .replace(/^0/, "90");
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const handleInstagram = () => {
    window.open(
      `https://instagram.com/${user.personalInfo.instagram}`,
      "_blank"
    );
  };

  const handleEmergencyCall = () => {
    const phoneNumber = user.emergency.phone.replace(/\s/g, "");
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div
      className="min-h-screen antialiased text-slate-200"
      style={
        {
          background: theme.gradients.background,
          "--primary-color": theme.colors.primary,
          "--secondary-color": theme.colors.secondary,
        } as React.CSSProperties
      }
    >
      <main className="relative mx-auto max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl grid place-items-center"
              style={{
                backgroundColor: `${theme.colors.primary}1A`,
                border: `1px solid ${theme.colors.primary}4D`,
                filter: `drop-shadow(0 6px 20px ${theme.colors.primary}40)`,
              }}
            >
              <svg
                className="h-5 w-5"
                style={{ color: theme.colors.primary }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3l6 3v5c0 4.97-3.05 9.41-6 10-2.95-.59-6-5.03-6-10V6l6-3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {user.motorcycle.brand}
              </p>
              <h1 className="text-xl font-semibold text-white">
                {user.motorcycle.model}
              </h1>
            </div>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
            {user.tag === "DEMO"
              ? "DEMO"
              : user.personalInfo.name.split(" ")[0]}
          </span>
        </header>

        {/* Card */}
        <section className="backdrop-blur-lg bg-gradient-to-b from-white/6 to-white/3 border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
          {/* Bike visual */}
          <div className="relative">
            <div
              className="h-36 sm:h-44 md:h-48"
              style={{
                background: `linear-gradient(to right, #0f172a, ${theme.colors.secondary}, #0f172a)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
            </div>
            <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2">
              <MotorcycleLogo
                brand={user.motorcycle.brand}
                model={user.motorcycle.model}
                size="xl"
                variant="card"
                className="pointer-events-none select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 md:p-7">
            {/* Bike Info */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Marka/Model
              </p>
              <p className="mt-1 text-base sm:text-lg font-semibold text-white">
                {user.motorcycle.brand} {user.motorcycle.model}
              </p>
            </div>

            {/* Plaka ve Renk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">
                  Plaka
                </p>
                <div className="mt-2 bg-white rounded-md border-2 border-gray-400 shadow-lg overflow-hidden">
                  <div className="flex">
                    <div className="bg-blue-600 flex items-center justify-center px-2 py-3 min-w-[32px]">
                      <span className="text-white font-black text-xs tracking-tight">
                        TR
                      </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-1 bg-white">
                      <span className="text-black font-black text-lg tracking-widest text-center">
                        {user.motorcycle.plate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">
                  Renk Paleti
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="h-8 w-8 rounded-full shadow-lg ring-2"
                      style={
                        {
                          backgroundColor: theme.colors.primary,
                          "--tw-ring-color": `${theme.colors.primary}4D`,
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-xs text-slate-300">Ana</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="h-6 w-6 rounded-full shadow-lg ring-2"
                      style={
                        {
                          backgroundColor: theme.colors.secondary,
                          "--tw-ring-color": "rgba(255,255,255,0.2)",
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-xs text-slate-400">İkincil</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-5 w-5 rounded-full bg-slate-400 ring-1 ring-slate-400/30 shadow-lg" />
                    <span className="text-xs text-slate-500">Detay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner / Contact */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm7 9a1 1 0 001-1 7 7 0 00-7-7H11a7 7 0 00-7 7 1 1 0 001 1h14z" />
                  </svg>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400">
                      İsim
                    </p>
                    <p className="mt-1 font-medium text-white">
                      {user.personalInfo.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 15.46l-5.27-.61a1 1 0 00-.9.28l-2.59 2.59a16 16 0 01-7.56-7.56l2.59-2.59a1 1 0 00.28-.9L8.54 3H3.51A1.5 1.5 0 002 4.51 18.5 18.5 0 0021.49 24 1.5 1.5 0 0023 22.49V17.5a1 1 0 00-2-.04z" />
                  </svg>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400">
                      Telefon
                    </p>
                    <p className="mt-1 font-medium text-white">
                      {user.personalInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    style={{ color: theme.colors.primary }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 4H4a2 2 0 00-2 2v.4l10 6.25L22 6.4V6a2 2 0 00-2-2zm0 4.8l-8 5-8-5V18a2 2 0 002 2h12a2 2 0 002-2V8.8z" />
                  </svg>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400">
                      E-posta
                    </p>
                    <p className="mt-1 truncate font-medium text-white">
                      {user.personalInfo.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kan grubu */}
            <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4">
              <p className="text-[11px] uppercase tracking-wider text-red-300">
                Kan Grubu
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {user.personalInfo.bloodType}
              </p>
            </div>

            {/* Not ve İletişim */}
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                Not
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {user.note}
              </p>

              {/* İletişim Butonları */}
              <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
                <button
                  onClick={handleCall}
                  className="tap-highlight-none group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/20 active:translate-y-0"
                >
                  <svg
                    className="h-5 w-5 transition group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                  Ara
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="tap-highlight-none group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/20 transition hover:-translate-y-0.5 hover:bg-emerald-500/25 active:translate-y-0"
                >
                  <svg
                    className="h-5 w-5 transition group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 3.5A10.5 10.5 0 006.6 20.7L3 21l1-3.6A10.5 10.5 0 1020 3.5zM7.8 8.4c.2-.5.4-.5.7-.5h.6c.2 0 .5 0 .7.6s.8 1.9.9 2-.1.4-.3.6-.5.6-.7.8c-.1.2-.3.4 0 .8s1.2 1.9 2.6 2.6c1.3.8 1.6.7 1.9.6.3-.1.9-.4 1-.7.1-.4.5-.7.7-.9s.4-.3.3-.6-.3-1-.7-1.5c-.4-.5-.8-.4-1.1-.3s-.7.5-.8.7c-.2.2-.4.3-.7.1s-1.3-.5-2-1.2c-.7-.7-1.2-1.5-1.4-1.7-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5z" />
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={handleInstagram}
                  className="tap-highlight-none group inline-flex items-center justify-center gap-2 rounded-xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/20 via-pink-500/20 to-orange-400/20 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-pink-200 ring-1 ring-fuchsia-400/20 transition hover:-translate-y-0.5 hover:from-fuchsia-500/30 hover:via-pink-500/30 hover:to-orange-400/30 active:translate-y-0"
                >
                  <svg
                    className="h-5 w-5 transition group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                  Instagram
                </button>
              </div>
            </div>

            {/* Acil Durum */}
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
              <p className="text-[11px] uppercase tracking-wider text-red-300 mb-3">
                Acil Durum
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">
                    İsim
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    {user.emergency.name}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400">
                    Telefon
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    {user.emergency.phone}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleEmergencyCall}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                  Acil Ara
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] text-slate-400">
              Bu kart, araç üzerinde kolay erişim için tasarlanmıştır. Lütfen
              güvenli sürüşü destekleyin.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            Asnus
          </span>
          <span>v2.7</span>
        </div>
      </main>
    </div>
  );
}
