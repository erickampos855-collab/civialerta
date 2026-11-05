import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo-instituto.png.asset.json";

const NAV = [
  { to: "/", label: "Painel" },
  { to: "/historico", label: "Histórico" },
  { to: "/assistente", label: "Assistente IA" },
  { to: "/admin", label: "Administração" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="Instituto Estadual de Educação Dr. Caetano Munhoz da Rocha — Paranaguá"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full bg-foreground object-contain p-0.5"
          />
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold uppercase tracking-tight">
              Alerta Civil <span className="text-primary">Inteligente</span>
            </p>
            <p className="text-xs text-muted-foreground">Estação meteorológica · Paranaguá</p>
          </div>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-navy hover:text-foreground data-[status=active]:bg-navy data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
