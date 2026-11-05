import { useState } from "react";
import { MAP_H, MAP_W, STATES, project } from "@/lib/brazil-map";
import { TEMP_FILL, tempBand, type CityWeather } from "@/lib/weather-data";
import { cn } from "@/lib/utils";

/** SVG map of Brazil with a colored temperature bubble on each city. */
export function BrazilTemperatureMap({
  cidades,
  selected,
  onSelect,
}: {
  cidades: CityWeather[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const active = hover ?? selected;

  return (
    <svg
      viewBox={`-10 -10 ${MAP_W + 20} ${MAP_H + 20}`}
      className="h-auto w-full"
      role="img"
      aria-label="Mapa do Brasil com a temperatura atual das capitais"
    >
      <g>
        {STATES.map((s) => (
          <path key={s.uf} d={s.d} className="fill-map-land stroke-map-stroke" strokeWidth={1} strokeLinejoin="round">
            <title>{s.nome}</title>
          </path>
        ))}
      </g>
      <g>
        {cidades.map((c) => {
          const key = `${c.uf}-${c.nome}`;
          const [x, y] = project(c.lon, c.lat);
          const isActive = active === key;
          const band = tempBand(c.temperatura);
          return (
            <g
              key={key}
              transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(key)}
              role="button"
              tabIndex={0}
              aria-label={`${c.nome}: ${Math.round(c.temperatura)} graus`}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(key)}
            >
              {c.estacao && <circle r={isActive ? 30 : 26} className="fill-none stroke-primary" strokeWidth={3} />}
              <circle
                r={isActive ? 24 : 19}
                className={cn(TEMP_FILL[band], "stroke-background transition-all")}
                strokeWidth={3}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none fill-temp-foreground font-display font-extrabold"
                fontSize={isActive ? 17 : 14}
              >
                {Math.round(c.temperatura)}°
              </text>
              {isActive && (
                <text
                  y={-36}
                  textAnchor="middle"
                  className="pointer-events-none fill-foreground stroke-background font-display font-bold"
                  strokeWidth={5}
                  paintOrder="stroke"
                  fontSize={20}
                >
                  {c.nome}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
