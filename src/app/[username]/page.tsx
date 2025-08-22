import { notFound } from "next/navigation";
import { User } from "@/types/user";
import { themes } from "@/config/themes";
import usersData from "@/data/users.json";
import demoUsersData from "@/data/demo-users.json";
import TagCard from "@/components/TagCard";
import { getUserByUniqueUrl } from "@/services/firebase";
import AdBanner from "@/components/AdBanner";

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
  const staticUsers = usersData as Record<string, User>;
  const allStaticUsers = { ...staticUsers, ...demoUsers };

  return Object.keys(allStaticUsers).map((username) => ({
    username,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const users = usersData as Record<string, User>;
  const demoUsers = demoUsersData as Record<string, User>;
  const allUsers = { ...users, ...demoUsers };
  const user = allUsers[resolvedParams.username];

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
    : `${user.motorcycle.brand} ${user.motorcycle.model} • ${user.personalInfo.name}`;

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
    user = await getUserByUniqueUrl(resolvedParams.username);
    if (user) {
      console.log("✅ Firebase'de kullanıcı bulundu:", user.personalInfo.name);
    } else {
      console.log("❌ Firebase'de kullanıcı bulunamadı");
    }
  } catch (error) {
    console.error("❌ Firebase kullanıcı getirme hatası:", error);
  }

  // Firebase'de bulunamazsa, statik verilerden ara (demo ve mevcut kullanıcılar için)
  if (!user) {
    console.log("📁 Statik verilerden aranıyor...");
    const users = usersData as Record<string, User>;
    const demoUsers = demoUsersData as Record<string, User>;
    const allUsers = { ...users, ...demoUsers };
    user = allUsers[resolvedParams.username];

    if (user) {
      console.log(
        "✅ Statik veride kullanıcı bulundu:",
        user.personalInfo.name
      );
    } else {
      console.log("❌ Statik veride de kullanıcı bulunamadı");
      console.log("🔑 Mevcut statik kullanıcılar:", Object.keys(allUsers));
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

  // Reklam gösterimi kontrolü - demo kullanıcılar için varsayılan olarak false
  const shouldShowAds =
    user.showAds !== undefined ? user.showAds : user.tag !== "DEMO";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Üst Reklam Alanı */}
      {shouldShowAds && (
        <div className="container mx-auto px-4 pt-4">
          <AdBanner position="top" showAds={shouldShowAds} />
        </div>
      )}

      {/* Tag Card */}
      <TagCard user={user} theme={theme} />

      {/* Alt Reklam Alanı */}
      {shouldShowAds && (
        <div className="container mx-auto px-4 pb-4">
          <AdBanner position="bottom" showAds={shouldShowAds} />
        </div>
      )}
    </div>
  );
}
