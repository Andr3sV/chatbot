"use client";

const BRAND_COLOR = "#BEFF50";
const COMPETITOR_COLOR = "#D4D4D4"; // Gris claro

type DataPoint = { month: string; marca: number; competidores: number[] };

function pointsToPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const smooth = 0.2;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 2] || points[i - 1];
    const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[i + 1] || points[i];
    const cp1x = p1.x + (p2.x - p0.x) * smooth;
    const cp1y = p1.y + (p2.y - p0.y) * smooth;
    const cp2x = p2.x - (p3.x - p1.x) * smooth;
    const cp2y = p2.y - (p3.y - p1.y) * smooth;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function ScoringLineChart({
  data,
  height = 140,
  showLegend = true,
}: {
  data: DataPoint[];
  height?: number;
  showLegend?: boolean;
}) {
  const padding = { top: 12, right: 16, bottom: 28, left: 16 };
  const chartWidth = 260;
  const chartHeight = height - padding.top - padding.bottom;
  const totalWidth = chartWidth + padding.left + padding.right;

  const marcaPoints = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.marca / 100) * chartHeight;
    return { x, y };
  });

  const competitorLines = data[0]?.competidores?.length
    ? data[0].competidores.map((_, ci) =>
        data.map((d, i) => {
          const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
          const val = d.competidores[ci] ?? d.competidores[0];
          const y = padding.top + chartHeight - (val / 100) * chartHeight;
          return { x, y };
        })
      )
    : [];

  const gridLines = 4;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = padding.top + (i / gridLines) * chartHeight;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              stroke="#E5E5E5"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Competitor lines */}
        {competitorLines.map((points, ci) => (
          <path
            key={ci}
            d={pointsToPath(points)}
            fill="none"
            stroke={COMPETITOR_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* Brand line */}
        <path
          d={pointsToPath(marcaPoints)}
          fill="none"
          stroke={BRAND_COLOR}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Month labels */}
        {data.map((d, i) => (
          <text
            key={d.month}
            x={padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth}
            y={height - 8}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10 }}
          >
            {d.month}
          </text>
        ))}
      </svg>
      {showLegend && (
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2 w-4 rounded-sm"
              style={{ backgroundColor: BRAND_COLOR }}
            />
            Tu marca
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block h-0.5 w-4 rounded"
              style={{ backgroundColor: COMPETITOR_COLOR }}
            />
            Tus competidores
          </span>
        </div>
      )}
    </div>
  );
}

export const MOCK_SCORING_TREND: DataPoint[] = [
  { month: "Ene", marca: 65, competidores: [72, 78] },
  { month: "Feb", marca: 88, competidores: [85, 90] },
  { month: "Mar", marca: 72, competidores: [80, 82] },
  { month: "Abr", marca: 58, competidores: [75, 78] },
  { month: "May", marca: 75, competidores: [70, 76] },
  { month: "Jun", marca: 82, competidores: [85, 88] },
];
