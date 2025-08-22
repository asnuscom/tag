export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  gradients: {
    background: string;
    card: string;
  };
}

export const themes: Record<string, ThemeConfig> = {
  husqvarna: {
    name: 'Husqvarna',
    colors: {
      primary: '#F5C400',
      secondary: '#0B1B2B',
      accent: '#9EF01A',
      background: '#0b121e',
      surface: '#0f172a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(245,196,0,0.06), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(158,240,26,0.06), transparent 60%), linear-gradient(180deg, #0b121e 0%, #0b1b2b 100%)',
      card: 'from-slate-900 via-husky-blue to-slate-900'
    }
  },
  honda: {
    name: 'Honda',
    colors: {
      primary: '#DC143C',
      secondary: '#B71C1C',
      accent: '#FF4444',
      background: '#0f0f0f',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(220,20,60,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,68,68,0.06), transparent 60%), linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-honda-darkred to-slate-900'
    }
  },
  yamaha: {
    name: 'Yamaha',
    colors: {
      primary: '#0066CC',
      secondary: '#003D7A',
      accent: '#00BFFF',
      background: '#0a0e1a',
      surface: '#1c1c1e'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(0,102,204,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(74,144,226,0.06), transparent 60%), linear-gradient(180deg, #0a0e1a 0%, #1c1c1e 100%)',
      card: 'from-slate-900 via-yamaha-darkblue to-slate-900'
    }
  },
  triumph: {
    name: 'Triumph',
    colors: {
      primary: '#D4AF37',
      secondary: '#2D5016',
      accent: '#8FBC8F',
      background: '#0f1a0a',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(45,80,22,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(212,175,55,0.06), transparent 60%), linear-gradient(180deg, #0f1a0a 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-triumph-green to-slate-900'
    }
  },
  cfmoto: {
    name: 'CFMoto',
    colors: {
      primary: '#FF6B35',
      secondary: '#1A1A1A',
      accent: '#FF8C69',
      background: '#0f0f0f',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(255,107,53,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,140,105,0.06), transparent 60%), linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-orange-900 to-slate-900'
    }
  },
  kawasaki: {
    name: 'Kawasaki',
    colors: {
      primary: '#00A651',
      secondary: '#1A1A1A',
      accent: '#4CBB17',
      background: '#0a0f0a',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(0,166,81,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(76,187,23,0.06), transparent 60%), linear-gradient(180deg, #0a0f0a 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-green-900 to-slate-900'
    }
  },
  jawa: {
    name: 'Jawa',
    colors: {
      primary: '#8B0000',
      secondary: '#2F2F2F',
      accent: '#DC143C',
      background: '#0f0a0a',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(139,0,0,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(220,20,60,0.06), transparent 60%), linear-gradient(180deg, #0f0a0a 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-red-900 to-slate-900'
    }
  },
  rks: {
    name: 'RKS',
    colors: {
      primary: '#4169E1',
      secondary: '#1A1A1A',
      accent: '#6495ED',
      background: '#0a0a0f',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(65,105,225,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(100,149,237,0.06), transparent 60%), linear-gradient(180deg, #0a0a0f 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-blue-900 to-slate-900'
    }
  },
  suzuki: {
    name: 'Suzuki',
    colors: {
      primary: '#FFD700',
      secondary: '#1A1A1A',
      accent: '#FFA500',
      background: '#0f0f0a',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(255,215,0,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,165,0,0.06), transparent 60%), linear-gradient(180deg, #0f0f0a 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-yellow-900 to-slate-900'
    }
  },
  bmw: {
    name: 'BMW',
    colors: {
      primary: '#0066CC',
      secondary: '#FFFFFF',
      accent: '#87CEEB',
      background: '#0a0f14',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(0,102,204,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(135,206,235,0.06), transparent 60%), linear-gradient(180deg, #0a0f14 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-blue-900 to-slate-900'
    }
  },
  ktm: {
    name: 'KTM',
    colors: {
      primary: '#FF6600',
      secondary: '#000000',
      accent: '#FF8C42',
      background: '#0f0a05',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(255,102,0,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,140,66,0.06), transparent 60%), linear-gradient(180deg, #0f0a05 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-orange-900 to-slate-900'
    }
  },
  ducati: {
    name: 'Ducati',
    colors: {
      primary: '#DC143C',
      secondary: '#FFFFFF',
      accent: '#FF6B6B',
      background: '#0f0505',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(220,20,60,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,107,107,0.06), transparent 60%), linear-gradient(180deg, #0f0505 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-red-900 to-slate-900'
    }
  },
  aprilia: {
    name: 'Aprilia',
    colors: {
      primary: '#E60026',
      secondary: '#000000',
      accent: '#FF4444',
      background: '#0f0505',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(230,0,38,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,68,68,0.06), transparent 60%), linear-gradient(180deg, #0f0505 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-red-900 to-slate-900'
    }
  },
  harley: {
    name: 'Harley-Davidson',
    colors: {
      primary: '#FF6600',
      secondary: '#000000',
      accent: '#FFA500',
      background: '#0f0805',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(255,102,0,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,165,0,0.06), transparent 60%), linear-gradient(180deg, #0f0805 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-orange-900 to-slate-900'
    }
  },
  benelli: {
    name: 'Benelli',
    colors: {
      primary: '#C41E3A',
      secondary: '#FFFFFF',
      accent: '#FF4757',
      background: '#0f0505',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(196,30,58,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,71,87,0.06), transparent 60%), linear-gradient(180deg, #0f0505 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-red-900 to-slate-900'
    }
  },
  moto_guzzi: {
    name: 'Moto Guzzi',
    colors: {
      primary: '#228B22',
      secondary: '#FFFFFF',
      accent: '#32CD32',
      background: '#050f05',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(34,139,34,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(50,205,50,0.06), transparent 60%), linear-gradient(180deg, #050f05 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-green-900 to-slate-900'
    }
  },
  mv_agusta: {
    name: 'MV Agusta',
    colors: {
      primary: '#DC143C',
      secondary: '#C0C0C0',
      accent: '#FF1744',
      background: '#0f0505',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(220,20,60,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,23,68,0.06), transparent 60%), linear-gradient(180deg, #0f0505 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-red-900 to-slate-900'
    }
  },
  indian: {
    name: 'Indian',
    colors: {
      primary: '#8B0000',
      secondary: '#FFD700',
      accent: '#DC143C',
      background: '#0f0505',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(139,0,0,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(220,20,60,0.06), transparent 60%), linear-gradient(180deg, #0f0505 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-red-900 to-slate-900'
    }
  },
  royal_enfield: {
    name: 'Royal Enfield',
    colors: {
      primary: '#2E8B57',
      secondary: '#F5DEB3',
      accent: '#3CB371',
      background: '#050f08',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(46,139,87,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(60,179,113,0.06), transparent 60%), linear-gradient(180deg, #050f08 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-green-900 to-slate-900'
    }
  },
  bajaj: {
    name: 'Bajaj',
    colors: {
      primary: '#FF6B35',
      secondary: '#FFFFFF',
      accent: '#FFD700',
      background: '#0a0f14',
      surface: '#1a1a1a'
    },
    gradients: {
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(255,107,53,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,215,0,0.06), transparent 60%), linear-gradient(180deg, #0a0f14 0%, #1a1a1a 100%)',
      card: 'from-slate-900 via-orange-900 to-slate-900'
    }
  }
};
