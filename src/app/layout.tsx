import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Asnus Tag System",
    default: "Asnus Tag System • Premium Motosiklet İletişim Kartları",
  },
  description:
    "Dünyanın en prestijli motosiklet markaları için özel tasarlanmış, kişiselleştirilmiş dijital iletişim kartları.",
  keywords:
    "motosiklet, iletişim kartı, dijital kart, asnus, honda, yamaha, bmw, ducati",
  authors: [{ name: "Asnus", url: "https://asnus.com" }],
  creator: "Asnus",
  robots: "index, follow",
  metadataBase: new URL("https://tag.asnus.com"),
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    telephone: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0066CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
