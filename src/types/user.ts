export interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  instagram: string;
  bloodType: string;
}

export interface Motorcycle {
  brand: string;
  model: string;
  plate: string;
  image: string;
}

export interface Emergency {
  name: string;
  phone: string;
}

export interface User {
  id: string;
  personalInfo: PersonalInfo;
  motorcycle: Motorcycle;
  emergency: Emergency;
  theme: 'honda' | 'yamaha' | 'kawasaki' | 'suzuki' | 'bmw' | 'ktm' | 'ducati' | 'aprilia' | 'harley' | 'triumph' | 'husqvarna' | 'cfmoto' | 'benelli' | 'moto_guzzi' | 'mv_agusta' | 'indian' | 'royal_enfield' | 'jawa' | 'rks' | 'bajaj';
  tag: string;
  note: string;
}

export interface UsersData {
  [key: string]: User;
}
