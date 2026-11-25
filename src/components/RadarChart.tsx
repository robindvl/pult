import type { DiagnosticBlock } from "@/data/diagnostics";

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MAX = 3;

function polar(index: number, total: number, value: number) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  const r = (value / MAX) * (SIZE * 0.36);
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

export function RadarChart({ blocks }: { blocks: DiagnosticBlock[] }) {
  const total = blocks.length;
  const rings = [1, 2, 3];

  const gridPolygons = rings.map((level) =>
    blocks
      .map((_, i) => {
        const p = polar(i, total, level);
        return `${p.x},${p.y}`;
      })
      .join(" "),
  );

  const dataPoints = blocks.map((b, i) => polar(i, total, b.score));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-64 w-64 sm:h-72 sm:w-72"
      role="img"
      aria-label="Роза ветров по 6 блокам диагностики"
    >
      {gridPolygons.map((points, i) => (
        <polygon
          key={rings[i]}
          points={points}
          fill="none"
          stroke="#d6d3d1"
          strokeWidth="1"
        />
      ))}

      {blocks.map((_, i) => {
        const edge = polar(i, total, MAX);
        return (
          <line
            key={`axis-${i}`}
            x1={CX}
            y1={CY}
            x2={edge.x}
            y2={edge.y}
            stroke="#e7e5e4"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={dataPolygon}
        fill="rgba(13, 148, 136, 0.22)"
        stroke="#0f766e"
        strokeWidth="2"
      />

      {dataPoints.map((p, i) => (
        <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#0f766e" />
      ))}

      {blocks.map((block, i) => {
        const label = polar(i, total, MAX + 0.55);
        return (
          <text
            key={block.id}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-stone-600"
            fontSize="11"
            fontWeight="500"
          >
            {block.name}
          </text>
        );
      })}
    </svg>
  );
}
