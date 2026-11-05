/**
 * Server-only weather lookups using Open-Meteo (free, no key).
 * https://open-meteo.com — current conditions are model data, not official forecasts.
 */
import { describeWeather, type City, type CityWeather } from "./weather-data";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CURRENT_FIELDS = "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m";

interface OpenMeteoCurrent {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

export async function fetchCurrentWeather(cities: City[]): Promise<CityWeather[]> {
  const params = new URLSearchParams({
    latitude: cities.map((c) => c.lat).join(","),
    longitude: cities.map((c) => c.lon).join(","),
    current: CURRENT_FIELDS,
    timezone: "America/Sao_Paulo",
    wind_speed_unit: "kmh",
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) {
    const body = await res.text();
    console.error(`Open-Meteo forecast failed [${res.status}]: ${body}`);
    throw new Error(`Serviço de clima indisponível (${res.status})`);
  }
  const json = (await res.json()) as OpenMeteoCurrent | OpenMeteoCurrent[];
  const list = Array.isArray(json) ? json : [json];
  return cities.flatMap((city, i) => {
    const c = list[i]?.current;
    if (!c) return [];
    return [
      {
        ...city,
        temperatura: c.temperature_2m,
        sensacao: c.apparent_temperature,
        umidade: c.relative_humidity_2m,
        vento: c.wind_speed_10m,
        codigo: c.weather_code,
        condicao: describeWeather(c.weather_code),
        horario: c.time,
      },
    ];
  });
}

interface GeocodeResult {
  results?: { name: string; latitude: number; longitude: number; admin1?: string; country_code: string }[];
}

/** Find a Brazilian city by name (optionally filtered by state name or UF). */
export async function geocodeBrazil(cidade: string, estado: string | null): Promise<City | null> {
  const params = new URLSearchParams({ name: cidade, count: "10", language: "pt", countryCode: "BR", format: "json" });
  const res = await fetch(`${GEOCODE_URL}?${params}`);
  if (!res.ok) {
    console.error(`Open-Meteo geocoding failed [${res.status}]: ${await res.text()}`);
    throw new Error(`Busca de cidade indisponível (${res.status})`);
  }
  const json = (await res.json()) as GeocodeResult;
  const results = (json.results ?? []).filter((r) => r.country_code === "BR");
  if (!results.length) return null;
  const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const wanted = estado ? norm(estado) : null;
  const match = wanted ? results.find((r) => r.admin1 && norm(r.admin1).includes(wanted)) : undefined;
  const r = match ?? results[0]!;
  return { uf: r.admin1 ?? "", nome: r.name, lat: r.latitude, lon: r.longitude };
}
