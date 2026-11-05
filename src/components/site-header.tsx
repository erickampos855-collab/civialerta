import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import logo from "@/assets/logo-instituto.png";
import { LANGS, setLang, useLang, useT, type TKey } from "@/lib/i18n";

const NAV = [
  { to: "/", label: "nav.painel" },
  { to: "/brasil", label: "nav.brasil" },
  { to: "/historico", label: "nav.historico" },
  { to: "/assistente", label: "nav.assistente" },
  { to: "/voz", label: "nav.voz" },
  { to: "/admin", label: "nav.admin" },
] as const satisfies readonly { to: string; label: TKey }[];

export function SiteHeader() {
  const t = useT();
  const lang = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1 px-3 py-2 md:px-4 md:py-3">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2 md:gap-3">
          <img
            src={logo}
            alt="Instituto Estadual de Educação Dr. Caetano Munhoz da Rocha — Paranaguá"
            width={56}
            height={56}
            className="size-10 shrink-0 rounded-full bg-foreground object-contain p-0.5 md:size-14"
          />
          <div className="min-w-0 leading-tight">
            <p className="font-display text-base font-extrabold uppercase tracking-tight md:text-lg">
              Alerta Civil <span className="text-primary">Inteligente</span>
            </p>
            <p className="truncate text-xs text-muted-foreground">{t("header.sub")}</p>
          </div>
        </Link>
        <label className="ml-auto flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-sm md:order-last md:ml-1">
          <Languages className="size-4 text-primary" aria-hidden />
          <span className="sr-only">{t("lang.label")}</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as typeof lang)}
            className="bg-transparent font-semibold text-foreground outline-none"
            aria-label={t("lang.label")}
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id} className="bg-card">
                {l.flag}
              </option>
            ))}
          </select>
        </label>
        <nav className="-mx-3 flex w-full gap-1 overflow-x-auto px-3 md:mx-0 md:ml-auto md:w-auto md:flex-wrap md:overflow-visible md:px-0">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-navy hover:text-foreground data-[status=active]:bg-navy data-[status=active]:text-primary"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
