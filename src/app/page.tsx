import Link from "next/link";
import { Metadata } from "next";
import { themes } from "@/config/themes";
import demoUsersData from "@/data/demo-users.json";
import { User } from "@/types/user";

export const metadata: Metadata = {
  title: "Asnus Tag System • Premium Motosiklet İletişim Kartları",
  description:
    "Dünyanın en prestijli motosiklet markaları için özel tasarlanmış, kişiselleştirilmiş dijital iletişim kartları. Honda, Yamaha, BMW, Ducati ve daha fazlası.",
  keywords:
    "motosiklet, iletişim kartı, dijital kart, asnus, honda, yamaha, bmw, ducati, kawasaki, suzuki, ktm, triumph, harley davidson",
  authors: [{ name: "Asnus", url: "https://asnus.com" }],
  creator: "Asnus",
  publisher: "Asnus",
  robots: "index, follow",
  openGraph: {
    title: "Asnus Tag System • Premium Motosiklet İletişim Kartları",
    description:
      "Dünyanın en prestijli motosiklet markaları için özel tasarlanmış, kişiselleştirilmiş dijital iletişim kartları.",
    type: "website",
    url: "https://tag.asnus.com",
    siteName: "Asnus Tag System",
    images: [
      {
        url: "/api/og-image",
        width: 1200,
        height: 630,
        alt: "Asnus Tag System - Premium Motosiklet İletişim Kartları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asnus Tag System • Premium Motosiklet İletişim Kartları",
    description:
      "Dünyanın en prestijli motosiklet markaları için özel tasarlanmış, kişiselleştirilmiş dijital iletişim kartları.",
    images: ["/api/og-image"],
    creator: "@asnus",
  },

  alternates: {
    canonical: "https://tag.asnus.com",
  },
};

export default function HomePage() {
  // Popülerlikten az bilinene doğru sıralama
  const brands = [
    {
      name: "Honda",
      description: "Japon güvenilirlik ve mühendislik mükemmeliyeti",
      theme: themes.honda,
      features: ["CB Serisi", "Sport Touring", "Reliability"],
      year: "1948'den beri",
      demoUrl: "/demo-honda",
      popularity: "En Popüler",
    },
    {
      name: "Yamaha",
      description: "Japon performans ve teknoloji lideri",
      theme: themes.yamaha,
      features: ["YZF-R Serisi", "Supersport", "Racing DNA"],
      year: "1955'ten beri",
      demoUrl: "/demo-yamaha",
      popularity: "Çok Popüler",
    },
    {
      name: "Kawasaki",
      description: "Japon performans ve güç simgesi",
      theme: themes.kawasaki,
      features: ["Ninja Serisi", "Supersport", "Racing Heritage"],
      year: "1896'dan beri",
      demoUrl: "/demo-kawasaki",
      popularity: "Çok Popüler",
    },
    {
      name: "Suzuki",
      description: "Japon teknoloji ve güvenilirlik",
      theme: themes.suzuki,
      features: ["GSX-R Serisi", "Sport Bike", "Performance"],
      year: "1909'dan beri",
      demoUrl: "/demo-suzuki",
      popularity: "Popüler",
    },
    {
      name: "BMW",
      description: "Alman mühendislik mükemmeliyeti ve lüks",
      theme: themes.bmw,
      features: ["GS Serisi", "Adventure", "Premium Tech"],
      year: "1916'dan beri",
      demoUrl: "/demo-bmw",
      popularity: "Premium",
    },
    {
      name: "KTM",
      description: "Avusturya kökenli off-road ve performance uzmanı",
      theme: themes.ktm,
      features: ["Duke Serisi", "Off-Road", "Racing DNA"],
      year: "1992'den beri",
      demoUrl: "/demo-ktm",
      popularity: "Sporcu Favorisi",
    },
    {
      name: "Ducati",
      description: "İtalyan tutku ve supersport mükemmeliyeti",
      theme: themes.ducati,
      features: ["Panigale Serisi", "Supersport", "Italian Style"],
      year: "1926'dan beri",
      demoUrl: "/demo-ducati",
      popularity: "Premium Sport",
    },
    {
      name: "Aprilia",
      description: "İtalyan racing teknolojisi ve performans",
      theme: themes.aprilia,
      features: ["RSV4 Serisi", "Racing Tech", "MotoGP DNA"],
      year: "1945'ten beri",
      demoUrl: "/demo-aprilia",
      popularity: "Racing",
    },
    {
      name: "Harley-Davidson",
      description: "Amerikan motosiklet kültürünün efsanesi",
      theme: themes.harley,
      features: ["Cruiser", "American Classic", "Heritage"],
      year: "1903'ten beri",
      demoUrl: "/demo-harley",
      popularity: "Kült",
    },
    {
      name: "Triumph",
      description: "İngiliz motosiklet mirası ve zarafeti",
      theme: themes.triumph,
      features: ["Street Triple", "British Heritage", "Premium Craft"],
      year: "1902'den beri",
      demoUrl: "/demo-triumph",
      popularity: "Heritage",
    },
    {
      name: "Husqvarna",
      description: "İsveç kökenli premium motosiklet markası",
      theme: themes.husqvarna,
      features: ["Svartpilen Serisi", "Naked Bike", "Urban Mobility"],
      year: "1903'ten beri",
      demoUrl: "/demo-husqvarna",
      popularity: "Premium",
    },
    {
      name: "CFMoto",
      description: "Çin kökenli modern ve uygun fiyatlı motosikletler",
      theme: themes.cfmoto,
      features: ["NK Serisi", "Adventure", "Value for Money"],
      year: "1989'dan beri",
      demoUrl: "/demo-cfmoto",
      popularity: "Yükselen",
    },
    {
      name: "Benelli",
      description: "İtalyan tasarım ve uygun fiyat dengesi",
      theme: themes.benelli,
      features: ["TNT Serisi", "Naked Bike", "Italian Design"],
      year: "1911'den beri",
      demoUrl: "/demo-benelli",
      popularity: "Alternatif",
    },
    {
      name: "Moto Guzzi",
      description: "İtalyan klasik motosiklet sanatı",
      theme: themes.moto_guzzi,
      features: ["V7 Serisi", "Classic Style", "Italian Heritage"],
      year: "1921'den beri",
      demoUrl: "/demo-moto-guzzi",
      popularity: "Klasik",
    },
    {
      name: "MV Agusta",
      description: "İtalyan lüks ve performance sanatı",
      theme: themes.mv_agusta,
      features: ["Brutale Serisi", "Luxury Sport", "Exclusive"],
      year: "1945'ten beri",
      demoUrl: "/demo-mv-agusta",
      popularity: "Ultra Premium",
    },
    {
      name: "Indian",
      description: "Amerikan cruiser geleneğinin devamı",
      theme: themes.indian,
      features: ["Scout Serisi", "American Cruiser", "Heritage"],
      year: "1901'den beri",
      demoUrl: "/demo-indian",
      popularity: "Heritage",
    },
    {
      name: "Royal Enfield",
      description: "İngiliz klasik motosiklet geleneği",
      theme: themes.royal_enfield,
      features: ["Classic Serisi", "Retro Style", "British Heritage"],
      year: "1901'den beri",
      demoUrl: "/demo-royal-enfield",
      popularity: "Retro",
    },
    {
      name: "Jawa",
      description: "Çek cumhuriyeti klasik motosiklet markası",
      theme: themes.jawa,
      features: ["Klasik Tasarım", "Retro Style", "Heritage"],
      year: "1929'dan beri",
      demoUrl: "/demo-jawa",
      popularity: "Nostaljik",
    },
    {
      name: "RKS",
      description: "Türk motosiklet markası, yerli üretim",
      theme: themes.rks,
      features: ["Yerli Üretim", "Uygun Fiyat", "Türk Markası"],
      year: "2008'den beri",
      demoUrl: "/demo-rks",
      popularity: "Yerli",
    },
    {
      name: "Bajaj",
      description: "Hindistan'ın güvenilir motosiklet markası",
      theme: themes.bajaj,
      features: ["Ekonomik", "Dayanıklı", "Yakıt Tasarrufu"],
      year: "1945'ten beri",
      demoUrl: "/demo-bajaj",
      popularity: "Popüler",
    },
  ];

  const demoUsers = demoUsersData as Record<string, User>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 via-red-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
            Asnus Tag System
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl mb-3 sm:mb-4">
            Premium Motosiklet İletişim Kartları
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Dünyanın en prestijli motosiklet markaları için özel tasarlanmış,
            kişiselleştirilmiş dijital iletişim kartları
          </p>
        </div>

        {/* CTA Section - Yukarı taşındı */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 sm:p-6 md:p-8 max-w-lg mx-auto">
            <div className="mb-3 sm:mb-4">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-full border border-blue-500/30 mb-3 sm:mb-4">
                🚀 Hızlı Başlangıç
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Kendi Kartınızı Oluşturun
            </h2>
            <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Motosikletiniz için özel tasarlanmış, profesyonel iletişim
              kartınızı bugün oluşturun
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="mailto:info@asnus.com"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 justify-center text-sm sm:text-base"
              >
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                E-posta Gönder
              </a>
              <a
                href="https://wa.me/905421065299"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 justify-center text-sm sm:text-base"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 3.5A10.5 10.5 0 006.6 20.7L3 21l1-3.6A10.5 10.5 0 1020 3.5zM7.8 8.4c.2-.5.4-.5.7-.5h.6c.2 0 .5 0 .7.6s.8 1.9.9 2-.1.4-.3.6-.5.6-.7.8c-.1.2-.3.4 0 .8s1.2 1.9 2.6 2.6c1.3.8 1.6.7 1.9.6.3-.1.9-.4 1-.7.1-.4.5-.7.7-.9s.4-.3.3-.6-.3-1-.7-1.5c-.4-.5-.8-.4-1.1-.3s-.7.5-.8.7c-.2.2-.4.3-.7.1s-1.3-.5-2-1.2c-.7-.7-1.2-1.5-1.4-1.7-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5z" />
                </svg>
                WhatsApp
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-3 sm:mt-4">
              Profesyonel tasarım • Hızlı teslimat • 7/24 destek
            </p>
          </div>
        </div>

        {/* Markalar - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto mb-12 sm:mb-16">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:p-4 transition-all duration-500 hover:bg-slate-700/50 hover:border-slate-600 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${brand.theme.colors.primary}08, rgba(15, 23, 42, 0.8))`,
                borderColor: `${brand.theme.colors.primary}20`,
              }}
            >
              {/* Marka Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: brand.theme.colors.primary }}
                  />
                  <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-slate-100">
                    {brand.name}
                  </h2>
                </div>

                <div
                  className="px-2 py-1 rounded-full text-xs font-medium border"
                  style={{
                    borderColor: `${brand.theme.colors.primary}40`,
                    backgroundColor: `${brand.theme.colors.primary}10`,
                    color: brand.theme.colors.primary,
                  }}
                >
                  {brand.popularity}
                </div>
              </div>

              <p className="text-slate-400 text-xs mb-1 sm:mb-2">
                {brand.year}
              </p>

              {/* Açıklama */}
              <p className="text-slate-300 mb-2 sm:mb-3 leading-relaxed text-xs sm:text-sm">
                {brand.description}
              </p>

              {/* Özellikler */}
              <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                {brand.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">Demo</span>
                <Link
                  href={brand.demoUrl}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2"
                  style={{
                    backgroundColor: `${brand.theme.colors.primary}15`,
                    borderColor: `${brand.theme.colors.primary}30`,
                    color: brand.theme.colors.primary,
                    border: "1px solid",
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Görüntüle
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              🎯 Canlı Demo Sayfaları
            </h2>
            <p className="text-slate-300 mb-4 sm:mb-6 max-w-2xl text-sm sm:text-base">
              Her marka için hazırladığımız örnek kartları inceleyerek, kendi
              motosikletiniz için nasıl bir tasarım oluşturabileceğinizi
              görebilirsiniz.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2">
              {brands.map((brand) => (
                <Link
                  key={brand.name}
                  href={brand.demoUrl}
                  className="group p-1.5 sm:p-2 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                >
                  <div
                    className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: brand.theme.colors.primary }}
                  />
                  <div className="text-xs font-medium text-white group-hover:text-slate-200">
                    {brand.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              20
            </div>
            <div className="text-slate-400 text-xs sm:text-sm">
              Premium Marka
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              ∞
            </div>
            <div className="text-slate-400 text-xs sm:text-sm">
              Kişiselleştirme
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              24/7
            </div>
            <div className="text-slate-400 text-xs sm:text-sm">
              Erişilebilirlik
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
              QR
            </div>
            <div className="text-slate-400 text-xs sm:text-sm">
              Hızlı Erişim
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
