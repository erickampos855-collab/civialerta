import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { AlertDisplay } from "@/components/alert-display";
import { SensorGrid } from "@/components/sensor-grid";
import { LEVEL_SURFACE } from "@/components/alert-visuals";
import { Button } from "@/components/ui/button";
import { LEVEL_INFO, type Level } from "@/lib/alerts";
import { selectStatus, useStation } from "@/lib/station-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alerta Civil Inteligente — Painel de alertas" },
      { name: "description", content: "Veja agora a situação do tempo e os alertas de chuva, vento e enchente em Paranaguá." },
      { property: "og:title", content: "Alerta Civil Inteligente — Painel de alertas" },
      { property: "og:description", content: "Situação do tempo e alertas preventivos da estação meteorológica." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LEVEL_HINT: Record<Level, string> = {
  1: "Tempo normal",
  2: "Fique atento",
  3: "Tome cuidado",
  4: "Risco elevado",
};

function Index() {
  const s = useStation();
  const status = selectStatus(s);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      <AlertDisplay
        alerts={status.active}
        offline={status.offline}
        hydrated={s.hydrated}
        location={s.location}
        readings={s.readings}
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold">Sensores da estação</h2>
          <p className="text-sm text-muted-foreground">
            Dados simulados até a estação Arduino ser conectada · atualiza a cada 3 s
          </p>
        </div>
        <SensorGrid readings={s.readings} faulty={s.faultySensors} offline={status.offline} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Níveis de alerta</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {([1, 2, 3, 4] as Level[]).map((l) => (
              <div key={l} className={cn("rounded-2xl p-4", LEVEL_SURFACE[l])}>
                <p className="text-sm font-bold uppercase">Nível {l}</p>
                <p className="font-display text-xl font-extrabold">{LEVEL_INFO[l].nome}</p>
                <p className="text-sm font-semibold">{LEVEL_HINT[l]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glow flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <h2 className="text-xl font-bold">Ficou com dúvida?</h2>
            <p className="mt-1 text-muted-foreground">
              Pergunte à assistente de IA o que fazer em caso de chuva forte, enchente ou vento.
            </p>
          </div>
          <Button asChild variant="hero" size="lg">
            <Link to="/assistente">
              <MessageCircle /> Falar com a assistente
            </Link>
          </Button>
        </div>
      </section>

      <p className="pb-6 text-center text-sm text-muted-foreground">
        Emergência: Defesa Civil 199 · Bombeiros 193 · SAMU 192
      </p>
    </div>
  );
}
