// Motosiklet görseli mapping'i
export const getMotorcycleImage = (brand: string): string => {
  const imageMap: Record<string, string> = {
    honda: "/assets/logos/honda-logo.svg",
    yamaha: "/assets/logos/yamaha-logo.svg",
    kawasaki: "/assets/logos/kawasaki-logo.png",
    suzuki: "/assets/logos/suzuki-logo.png",
    bmw: "/assets/logos/bmw-logo.png",
    ktm: "/assets/logos/ktm-logo.png",
    ducati: "/assets/logos/ducati-logo.svg",
    aprilia: "/assets/logos/aprilia-logo.png",
    harley: "/assets/logos/harley-logo.png",
    triumph: "/assets/logos/triumph-logo.png",
    husqvarna: "/assets/logos/husqvarna-logo.png",
    cfmoto: "/assets/logos/cfmoto-logo.svg",
    benelli: "/assets/logos/benelli-logo.svg",
    moto_guzzi: "/assets/logos/moto-guzzi-logo.svg",
    mv_agusta: "/assets/logos/mv-agusta-logo.svg",
    indian: "/assets/logos/indian-logo.svg",
    royal_enfield: "/assets/logos/royal-enfield-logo.svg",
    jawa: "/assets/logos/jawa-logo.svg",
    rks: "/assets/logos/rks-logo.svg",
    bajaj: "/assets/logos/bajaj-logo.svg",
    zero: "/assets/logos/zero-logo.svg",
  };

  return imageMap[brand.toLowerCase()] || imageMap.honda; // Varsayılan Honda logo
};

// Marka adından theme key'e çevirme
export const getBrandThemeKey = (brandLabel: string): string => {
  const brandMap: Record<string, string> = {
    "Honda": "honda",
    "Yamaha": "yamaha", 
    "Kawasaki": "kawasaki",
    "Suzuki": "suzuki",
    "BMW": "bmw",
    "KTM": "ktm",
    "Ducati": "ducati",
    "Aprilia": "aprilia",
    "Harley-Davidson": "harley",
    "Triumph": "triumph",
    "Husqvarna": "husqvarna",
    "CFMoto": "cfmoto",
    "Benelli": "benelli",
    "Moto Guzzi": "moto_guzzi",
    "MV Agusta": "mv_agusta",
    "Indian": "indian",
    "Royal Enfield": "royal_enfield",
    "Jawa": "jawa",
    "RKS": "rks",
    "Bajaj": "bajaj",
    "Zero": "zero"
  };

  return brandMap[brandLabel] || "honda";
};

// Mevcut görsellerin listesi (kontrol için)
export const availableImages = [
  "aprilia-logo.png",
  "bajaj-logo.svg", 
  "benelli-logo.svg",
  "bmw-logo.png",
  "cfmoto-logo.svg",
  "ducati-logo.svg",
  "harley-logo.png",
  "honda-logo.svg",
  "husqvarna-logo.png",
  "indian-logo.svg",
  "jawa-logo.svg",
  "kawasaki-logo.png",
  "ktm-logo.png",
  "moto-guzzi-logo.svg",
  "mv-agusta-logo.svg",
  "rks-logo.svg",
  "royal-enfield-logo.svg",
  "suzuki-logo.png",
  "triumph-logo.png",
  "yamaha-logo.svg",
  "zero-logo.svg"
];
