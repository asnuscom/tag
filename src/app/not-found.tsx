import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Kullanıcı Bulunamadı</h2>
          <p className="text-slate-400 mb-8">
            Aradığınız motosiklet kartı sistemde kayıtlı değil.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Ana Sayfaya Dön
          </Link>

          <div className="pt-4">
            <p className="text-sm text-slate-500 mb-2">
              Yeni kart talebi için:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="mailto:info@asnus.com"
                className="text-sm px-4 py-2 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
              >
                E-posta
              </a>
              <a
                href="https://wa.me/905421065299"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
