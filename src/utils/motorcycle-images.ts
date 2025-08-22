// Motosiklet görseli mapping'i
export const getMotorcycleImage = (brand: string): string => {
  const imageMap: Record<string, string> = {
    honda: "/assets/motorcycles/honda-cb250r.png",
    yamaha: "/assets/motorcycles/yamaha-r25.png",
    kawasaki: "/assets/motorcycles/kawasaki-ninja250.png",
    suzuki: "/assets/motorcycles/suzuki-gsxr250.png",
    bmw: "/assets/motorcycles/bmw-g310r.webp",
    ktm: "/assets/motorcycles/ktm-duke250.png",
    ducati: "/assets/motorcycles/ducati-monster797.png",
    aprilia: "/assets/motorcycles/aprilia-rs125.png",
    harley: "/assets/motorcycles/harley-street750.png",
    triumph: "/assets/motorcycles/triumph-street-triple.png",
    husqvarna: "/assets/motorcycles/husqvarna-svartpilen.png",
    cfmoto: "/assets/motorcycles/cfmoto-nk250.png",
    benelli: "/assets/motorcycles/benelli-tnt25.png",
    moto_guzzi: "/assets/motorcycles/moto-guzzi-v7.png",
    mv_agusta: "/assets/motorcycles/mv-agusta-brutale800.png",
    indian: "/assets/motorcycles/indian-scout.png",
    royal_enfield: "/assets/motorcycles/royal-enfield-classic350.png",
    jawa: "/assets/motorcycles/jawa-42.png",
    rks: "/assets/motorcycles/rks-rs200.png",
    bajaj: "/assets/motorcycles/bajaj-pulsar.png",
    zero: "/assets/motorcycles/zero-srf.png",
  };

  return imageMap[brand.toLowerCase()] || imageMap.honda; // Varsayılan Honda
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
  "aprilia-rs125.png",
  "bajaj-pulsar.png", 
  "benelli-tnt25.png",
  "bmw-g310r.webp",
  "cfmoto-nk250.png",
  "ducati-monster797.png",
  "harley-street750.png",
  "honda-cb250r.png",
  "husqvarna-svartpilen.png",
  "indian-scout.png",
  "jawa-42.png",
  "kawasaki-ninja250.png",
  "ktm-duke250.png",
  "moto-guzzi-v7.png",
  "mv-agusta-brutale800.png",
  "rks-rs200.png",
  "royal-enfield-classic350.png",
  "suzuki-gsxr250.png",
  "triumph-street-triple.png",
  "yamaha-r25.png",
  "zero-srf.png"
];
