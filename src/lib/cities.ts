// src/lib/cities.ts
export type CityPreset = {
  tariff: number;
  petrol: number;
  discom?: string;
  updated?: string;
};

export const CITY_PRESETS: Record<string, CityPreset> = {
  Gurugram:  { tariff: 8.2, petrol: 96,  discom: "DHBVN",    updated: "2025-08-08" },
  Delhi:     { tariff: 8.0, petrol: 94,  discom: "BSES",     updated: "2025-08-08" },
  Mumbai:    { tariff: 9.5, petrol: 104, discom: "Adani",    updated: "2025-08-08" },
  Bengaluru: { tariff: 8.8, petrol: 101, discom: "BESCOM",   updated: "2025-08-08" },
  Hyderabad: { tariff: 9.0, petrol: 108, discom: "TSSPDCL",  updated: "2025-08-08" },
  Chennai:   { tariff: 8.6, petrol: 102, discom: "TANGEDCO", updated: "2025-08-08" },
  Kolkata:   { tariff: 8.4, petrol: 102, discom: "CESC",     updated: "2025-08-08" },
  Pune:      { tariff: 9.2, petrol: 105, discom: "MSEDCL",   updated: "2025-08-08" },
  Ahmedabad: { tariff: 8.1, petrol: 96,  discom: "Torrent",  updated: "2025-08-08" },
  Jaipur:    { tariff: 8.6, petrol: 103, discom: "JVVNL",    updated: "2025-08-08" },
  Lucknow:   { tariff: 8.3, petrol: 98,  discom: "UPPCL",    updated: "2025-08-08" },
  Surat:     { tariff: 8.0, petrol: 95,  discom: "DGVCL",    updated: "2025-08-08" },
  Indore:    { tariff: 8.2, petrol: 100, discom: "MPMKVVCL", updated: "2025-08-08" },
  Bhopal:    { tariff: 8.4, petrol: 101, discom: "MPMKVVCL", updated: "2025-08-08" },
  Patna:     { tariff: 8.7, petrol: 102, discom: "SBPDCL",   updated: "2025-08-08" },
  Chandigarh:{ tariff: 8.1, petrol: 96,  discom: "Admin",    updated: "2025-08-08" },
  Noida:     { tariff: 8.2, petrol: 96,  discom: "NPCL",     updated: "2025-08-08" },
  Ghaziabad: { tariff: 8.2, petrol: 96,  discom: "PVVNL",    updated: "2025-08-08" },
  Thane:     { tariff: 9.4, petrol: 104, discom: "MSEDCL",   updated: "2025-08-08" },
  Nagpur:    { tariff: 8.9, petrol: 100, discom: "MSEDCL",   updated: "2025-08-08" }
};
