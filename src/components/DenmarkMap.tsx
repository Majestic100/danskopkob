import { DK_VIEWBOX, dkDots, dkArcs, dkCities } from "@/data/denmarkDots";

// Prikkort over Danmark med de fem største byer og animerede forbindelser.
// Prik-laget injiceres som rå SVG (1150 cirkler) for at undgå tung JSX.
export function DenmarkMap() {
  return (
    <svg
      viewBox={DK_VIEWBOX}
      className="h-auto w-full"
      role="img"
      aria-label="Prikkort over Danmark med animerede forbindelser mellem de fem største byer: København, Aarhus, Odense, Aalborg og Esbjerg"
    >
      <g
        className="dk-dots"
        fill="#3b82f6"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: dkDots }}
      />

      <g className="dk-routes" aria-hidden="true">
        {dkArcs.map((a) => (
          <path key={a.id} className="dk-route" d={a.d} />
        ))}
        {dkArcs.map((a, i) => (
          <path
            key={`${a.id}-flow`}
            className="dk-flow"
            pathLength={1}
            d={a.d}
            style={{ animationDelay: `${(i * 0.55).toFixed(2)}s` }}
          />
        ))}
      </g>

      <g className="dk-cities">
        {dkCities.map((c) => (
          <g key={c.name}>
            <circle
              className="map-pulse"
              cx={c.x}
              cy={c.y}
              r={0.85}
              fill="#E11D2A"
            />
            <circle
              cx={c.x}
              cy={c.y}
              r={0.85}
              fill="#E11D2A"
              stroke="#ffffff"
              strokeWidth={0.2}
            />
            <text
              className="dk-city-label"
              x={c.lx}
              y={c.ly}
              textAnchor={c.anchor}
            >
              {c.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
