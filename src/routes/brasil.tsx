import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Droplets, RefreshCw, Thermometer, Wind } from "lucide-react";
import { BrazilTemperatureMap } from "@/components/brazil-temperature-map";
import { Button } from "@/components/ui/button";
import { getBrazilWeather } from "@/lib/weather.functions";
import { TEMP_BANDS, TEMP_BG, tempBand } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

const brazilWeatherQuery = queryOptions({
  queryKey: ["brazil-weather"],
  queryFn: () => getBrazilWeather(),
  staleTime: 5 * 60_000,
  refetchInterval: 10 * 60_000,
});

export const Route = createFileRoute("/brasil")({
  head: () => ({
    meta: [
      { title: "Temperatura no Brasil agora — Alerta Civil Inteligente" },
      { name: "description", content: "Mapa do Brasil com a temperatura atual das 27 capitais e de Paranaguá." },
      { property: "og:title", content: "Temperatura no Brasil agora — Alerta Civil Inteligente" },
      { property: "og:description", content: "Mapa com a temperatura atual das capitais brasileiras." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(brazilWeatherQuery),
  component: BrasilPage,
});

function BrasilPage() {
  const { data, refetch, isFetching } = useSuspenseQuery(brazilWeatherQuery);
  const [selected, setSelected] = useState<string | null>("PR-Paranaguá");

  const city = data.cidades.find((c) => `${c.uf}-${c.nome}` === selected) ?? null;
  const sorted = [...data.cidades].sort((a, b) => b.temperatura - a.temperatura);
  const hottest = sorted.slice(0, 3);
  const coldest = sorted.slice(-3).reverse();
  const updated = new Intl.DateTimeFormat("pt-BR", { timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(
    data.atualizadoEm,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Temperatura no Brasil agora</h1>
          <p className="text-muted-foreground">
            27 capitais e Paranaguá · atualizado às {updated} · dados Open-Meteo (não são alertas oficiais)
          </p>
        </div>
        <Button variant="navy" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={cn(isFetching && "animate-spin")} /> Atualizar
        </Button>
      </div>

      {data.erro ? (
        <div className="rounded-2xl border border-level-3 bg-card p-6">
          <p className="font-semibold">Não foi possível carregar as temperaturas agora.</p>
          <p className="text-sm text-muted-foreground">{data.erro}. Tente atualizar em alguns minutos.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-border bg-card p-3 md:p-5">
            <BrazilTemperatureMap cidades={data.cidades} selected={selected} onSelect={setSelected} />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
              {TEMP_BANDS.map((b, i) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  <span className={cn("size-3 rounded-full", TEMP_BG[i])} /> {b.label}
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-full border-2 border-primary" /> Estação da escola
              </span>
            </div>
          </div>

          <aside className="space-y-4">
            {city ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {city.estacao ? "Estação da escola" : `Capital · ${city.uf}`}
                </p>
                <h2 className="text-2xl font-black">{city.nome}</h2>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-2xl px-4 py-2 font-display text-5xl font-black text-temp-foreground",
                      TEMP_BG[tempBand(city.temperatura)],
                    )}
                  >
                    {Math.round(city.temperatura)}°
                  </span>
                  <p className="text-lg font-semibold">{city.condicao}</p>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  <li className="flex items-center gap-2"><Thermometer className="size-4 text-primary" /> Sensação de {Math.round(city.sensacao)}°</li>
                  <li className="flex items-center gap-2"><Droplets className="size-4 text-primary" /> Umidade {city.umidade}%</li>
                  <li className="flex items-center gap-2"><Wind className="size-4 text-primary" /> Vento {Math.round(city.vento)} km/h</li>
                </ul>
              </div>
            ) : (
              <p className="rounded-2xl border border-border bg-card p-5 text-muted-foreground">
                Toque em uma cidade no mapa para ver os detalhes.
              </p>
            )}

            <Ranking title="Mais quentes" list={hottest} onSelect={setSelected} />
            <Ranking title="Mais frias" list={coldest} onSelect={setSelected} />
          </aside>
        </div>
      )}
    </div>
  );
}

function Ranking({
  title,
  list,
  onSelect,
}: {
  title: string;
  list: { uf: string; nome: string; temperatura: number }[];
  onSelect: (key: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-2 font-bold">{title}</h3>
      <ul className="space-y-1">
        {list.map((c) => (
          <li key={`${c.uf}-${c.nome}`}>
            <button
              onClick={() => onSelect(`${c.uf}-${c.nome}`)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
            >
              <span>{c.nome} <span className="text-muted-foreground">· {c.uf}</span></span>
              <span className="font-display font-bold">{Math.round(c.temperatura)}°</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
