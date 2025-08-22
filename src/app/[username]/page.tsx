import { notFound } from "next/navigation";
import { User } from "@/types/user";
import { themes, ThemeConfig } from "@/config/themes";
import usersData from "@/data/users.json";
import demoUsersData from "@/data/demo-users.json";
import TagCard from "@/components/TagCard";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateStaticParams() {
  const users = usersData as Record<string, User>;
  const demoUsers = demoUsersData as Record<string, User>;
  const allUsers = { ...users, ...demoUsers };
  return Object.keys(allUsers).map((username) => ({
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
  const users = usersData as Record<string, User>;
  const demoUsers = demoUsersData as Record<string, User>;
  const allUsers = { ...users, ...demoUsers };
  const user = allUsers[resolvedParams.username];

  if (!user) {
    notFound();
  }

  const theme = themes[user.theme];

  return <TagCard user={user} theme={theme} />;
}
