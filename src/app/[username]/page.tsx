import { notFound } from "next/navigation";
import { User } from "@/types/user";
import { themes } from "@/config/themes";
import demoUsersData from "@/data/demo-users.json";
import TagCard from "@/components/TagCard";
import { getTagByUrl } from "@/services/tagService";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

// Dynamic routing için - tüm URL'lere izin ver
export const dynamicParams = true;

export async function generateStaticParams() {
  // Sadece demo kullanıcıları için static params oluştur
  // Dynamic kullanıcılar runtime'da handle edilir
  const demoUsers = demoUsersData as Record<string, User>;

  return Object.keys(demoUsers).map((username) => ({
    username,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;

  // Önce Firebase'den kullanıcıyı aramaya çalış
  let user: User | null = null;

  try {
    user = await getTagByUrl(resolvedParams.username);
  } catch (error) {
    console.error("Firebase kullanıcı getirme hatası:", error);
  }

  // Firebase'de bulunamazsa, demo verilerden ara
  if (!user) {
    const demoUsers = demoUsersData as Record<string, User>;
    user = demoUsers[resolvedParams.username];
  }

  if (!user) {
    return {
      title: "Kullanıcı Bulunamadı | Asnus Tag System",
      description:
        "Aradığınız motosiklet iletişim kartı bulunamadı. Kendi kartınızı oluşturmak için bizimle iletişime geçin.",
      keywords: "motosiklet, iletişim kartı, dijital kart, asnus",
      robots: "noindex, nofollow",
    };
  }

  const isDemo = user.tag === "DEMO";
  const title = isDemo
    ? `${user.motorcycle.brand} ${user.motorcycle.model} Demo • Asnus Tag System`
    : `${user.motorcycle.plate} • ${user.personalInfo.name} • Asnus Tag System`;

  const description = isDemo
    ? `${user.motorcycle.brand} ${user.motorcycle.model} demo motosiklet iletişim kartı. Kendi kartınızı oluşturmak için bizimle iletişime geçin.`
    : `${user.personalInfo.name} - ${user.motorcycle.brand} ${user.motorcycle.model} motosiklet iletişim kartı. Acil durumlar için kolay erişim.`;

  return {
    title,
    description,
    keywords: `${user.motorcycle.brand}, ${user.motorcycle.model}, motosiklet, iletişim kartı, dijital kart, ${user.personalInfo.name}, asnus, tag system`,
    authors: [{ name: "Asnus", url: "https://asnus.com" }],
    creator: "Asnus",
    publisher: "Asnus",
    robots: isDemo ? "index, follow" : "index, follow",
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://tag.asnus.com/${resolvedParams.username}`,
      siteName: "Asnus Tag System",
      images: [
        {
          url: user.motorcycle.image,
          width: 800,
          height: 600,
          alt: `${user.motorcycle.brand} ${user.motorcycle.model}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [user.motorcycle.image],
      creator: "@asnus",
    },
  };
}

export default async function UserPage({ params }: PageProps) {
  const resolvedParams = await params;
  console.log("🔍 Aranan kullanıcı:", resolvedParams.username);

  // Önce Firebase'den kullanıcıyı aramaya çalış
  let user: User | null = null;

  try {
    console.log("🔥 Firebase'den kullanıcı aranıyor...");
    user = await getTagByUrl(resolvedParams.username);
    if (user) {
      console.log("✅ Firebase'de kullanıcı bulundu:", user.personalInfo.name);
    } else {
      console.log("❌ Firebase'de kullanıcı bulunamadı");
    }
  } catch (error) {
    console.error("❌ Firebase kullanıcı getirme hatası:", error);
  }

  // Firebase'de bulunamazsa, demo verilerden ara
  if (!user) {
    console.log("📁 Demo verilerden aranıyor...");
    const demoUsers = demoUsersData as Record<string, User>;
    user = demoUsers[resolvedParams.username];

    if (user) {
      console.log("✅ Demo veride kullanıcı bulundu:", user.personalInfo.name);
    } else {
      console.log("❌ Demo veride de kullanıcı bulunamadı");
      console.log("🔑 Mevcut demo kullanıcılar:", Object.keys(demoUsers));
    }
  }

  if (!user) {
    console.log("🚫 Kullanıcı hiçbir yerde bulunamadı, 404 döndürülüyor");
    notFound();
  }

  // Tag aktif değilse 404 göster
  if ("isActive" in user && !user.isActive) {
    notFound();
  }

  const theme = themes[user.theme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Üst Reklam Alanı */}
      {/* {shouldShowAds && (
        <div className="container mx-auto px-4 pt-4">
          <AdBanner position="top" showAds={shouldShowAds} />
        </div>
      )} */}

      {/* Tag Card */}
      <TagCard user={user} theme={theme} />

      {/* Alt Reklam Alanı */}
      {/* {shouldShowAds && (
        <div className="container mx-auto px-4 pb-4">
          <AdBanner position="bottom" showAds={shouldShowAds} />
        </div>
      )} */}
    </div>
  );
}
