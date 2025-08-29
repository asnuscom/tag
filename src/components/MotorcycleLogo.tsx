import Image from "next/image";
import { getMotorcycleImage } from "@/utils/motorcycle-images";

interface MotorcycleLogoProps {
  brand: string;
  model?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "card" | "preview" | "dashboard";
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-36 sm:w-44 md:w-52 lg:w-60",
};

const containerClasses = {
  card: "bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-sm border border-white/10 shadow-2xl",
  preview: "bg-slate-800/60 border-2 border-slate-500/50 backdrop-blur-sm",
  dashboard: "bg-slate-800/40 border border-slate-500/30 backdrop-blur-sm",
};

export default function MotorcycleLogo({
  brand,
  model,
  size = "md",
  variant = "card",
  className = "",
}: MotorcycleLogoProps) {
  const logoSrc = getMotorcycleImage(brand);
  const sizeClass = sizeClasses[size];
  const containerClass = containerClasses[variant];

  // Marka bazlı özel efektler
  const getLogoFilter = (brandName: string, variantType: string) => {
    const brandLower = brandName.toLowerCase();

    if (variantType === "card") {
      // Ana kart için güçlü efektler
      switch (brandLower) {
        case "yamaha":
          return "drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 4px 15px rgba(0,0,0,0.6))";
        case "kawasaki":
          return "drop-shadow(0 0 15px rgba(255,255,255,0.6)) drop-shadow(0 4px 15px rgba(0,0,0,0.5))";
        case "suzuki":
          return "drop-shadow(0 0 12px rgba(0,0,0,0.8)) drop-shadow(0 4px 15px rgba(0,0,0,0.5))";
        default:
          return "drop-shadow(0 0 10px rgba(255,255,255,0.4)) drop-shadow(0 4px 15px rgba(0,0,0,0.6))";
      }
    } else {
      // Diğer varyantlar için hafif efektler
      return "drop-shadow(0 2px 8px rgba(0,0,0,0.4)) drop-shadow(0 0 6px rgba(255,255,255,0.2))";
    }
  };

  return (
    <div
      className={`${sizeClass} ${containerClass} rounded-xl flex items-center justify-center p-3 ${className}`}
    >
      <Image
        src={logoSrc}
        alt={`${brand}${model ? ` ${model}` : ""} logo`}
        width={
          size === "xl" ? 240 : size === "lg" ? 128 : size === "md" ? 80 : 64
        }
        height={
          size === "xl" ? 160 : size === "lg" ? 128 : size === "md" ? 80 : 64
        }
        className="object-contain"
        style={{
          filter: getLogoFilter(brand, variant),
          maxWidth: size === "xl" ? "220px" : size === "lg" ? "120px" : size === "md" ? "75px" : "60px",
          maxHeight: size === "xl" ? "140px" : size === "lg" ? "120px" : size === "md" ? "75px" : "60px",
          width: "auto",
          height: "auto"
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = getMotorcycleImage("honda");
        }}
      />
    </div>
  );
}
