/**
 * Browser-safe weather data: Brazilian state capitals, the station city,
 * weather-code descriptions and the temperature color scale.
 */

export interface City {
  uf: string;
  nome: string;
  lat: number;
  lon: number;
  estacao?: boolean;
}

export const CAPITALS: City[] = [
  { uf: "AC", nome: "Rio Branco", lat: -9.975, lon: -67.81 },
  { uf: "AL", nome: "Maceió", lat: -9.666, lon: -35.735 },
  { uf: "AP", nome: "Macapá", lat: 0.035, lon: -51.07 },
  { uf: "AM", nome: "Manaus", lat: -3.119, lon: -60.022 },
  { uf: "BA", nome: "Salvador", lat: -12.971, lon: -38.501 },
  { uf: "CE", nome: "Fortaleza", lat: -3.732, lon: -38.527 },
  { uf: "DF", nome: "Brasília", lat: -15.794, lon: -47.882 },
  { uf: "ES", nome: "Vitória", lat: -20.315, lon: -40.312 },
  { uf: "GO", nome: "Goiânia", lat: -16.686, lon: -49.265 },
  { uf: "MA", nome: "São Luís", lat: -2.53, lon: -44.303 },
  { uf: "MT", nome: "Cuiabá", lat: -15.601, lon: -56.097 },
  { uf: "MS", nome: "Campo Grande", lat: -20.469, lon: -54.62 },
  { uf: "MG", nome: "Belo Horizonte", lat: -19.917, lon: -43.934 },
  { uf: "PA", nome: "Belém", lat: -1.456, lon: -48.49 },
  { uf: "PB", nome: "João Pessoa", lat: -7.115, lon: -34.863 },
  { uf: "PR", nome: "Curitiba", lat: -25.429, lon: -49.271 },
  { uf: "PE", nome: "Recife", lat: -8.054, lon: -34.881 },
  { uf: "PI", nome: "Teresina", lat: -5.089, lon: -42.802 },
  { uf: "RJ", nome: "Rio de Janeiro", lat: -22.907, lon: -43.173 },
  { uf: "RN", nome: "Natal", lat: -5.795, lon: -35.209 },
  { uf: "RS", nome: "Porto Alegre", lat: -30.035, lon: -51.218 },
  { uf: "RO", nome: "Porto Velho", lat: -8.761, lon: -63.9 },
  { uf: "RR", nome: "Boa Vista", lat: 2.82, lon: -60.672 },
  { uf: "SC", nome: "Florianópolis", lat: -27.595, lon: -48.548 },
  { uf: "SP", nome: "São Paulo", lat: -23.551, lon: -46.633 },
  { uf: "SE", nome: "Aracaju", lat: -10.947, lon: -37.073 },
  { uf: "TO", nome: "Palmas", lat: -10.184, lon: -48.334 },
];

export const STATION_CITY: City = { uf: "PR", nome: "Paranaguá", lat: -25.516, lon: -48.525, estacao: true };

export const WEATHER_CODES: Record<number, string> = {
  0: "Céu limpo",
  1: "Poucas nuvens",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina com geada",
  51: "Garoa fraca",
  53: "Garoa",
  55: "Garoa forte",
  56: "Garoa congelante",
  57: "Garoa congelante forte",
  61: "Chuva fraca",
  63: "Chuva",
  65: "Chuva forte",
  66: "Chuva congelante",
  67: "Chuva congelante forte",
  71: "Neve fraca",
  73: "Neve",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva fracas",
  81: "Pancadas de chuva",
  82: "Pancadas de chuva fortes",
  85: "Pancadas de neve",
  86: "Pancadas de neve fortes",
  95: "Trovoada",
  96: "Trovoada com granizo",
  99: "Trovoada com granizo forte",
};

export function describeWeather(code: number | null | undefined): string {
  return code === null || code === undefined ? "—" : (WEATHER_CODES[code] ?? "—");
}

export interface CityWeather extends City {
  temperatura: number;
  sensacao: number;
  umidade: number;
  vento: number;
  codigo: number;
  condicao: string;
  horario: string;
}

/** Temperature bands (°C) for the map colors. Index 0..5. */
export const TEMP_BANDS = [
  { max: 15, label: "até 15°" },
  { max: 20, label: "15–20°" },
  { max: 25, label: "20–25°" },
  { max: 30, label: "25–30°" },
  { max: 35, label: "30–35°" },
  { max: Infinity, label: "acima de 35°" },
] as const;

export function tempBand(t: number): number {
  return TEMP_BANDS.findIndex((b) => t < b.max);
}

/** Static class names so Tailwind keeps them. */
export const TEMP_FILL = ["fill-temp-1", "fill-temp-2", "fill-temp-3", "fill-temp-4", "fill-temp-5", "fill-temp-6"];
export const TEMP_BG = ["bg-temp-1", "bg-temp-2", "bg-temp-3", "bg-temp-4", "bg-temp-5", "bg-temp-6"];
