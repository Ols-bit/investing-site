type CalculatorLineSeries = {
  label: string;
  color: string;
  values: number[];
};

type CalculatorLineChartProps = {
  description: string;
  series: CalculatorLineSeries[];
  xLabels: [string, string, string];
};

const WIDTH = 640;
const HEIGHT = 250;
const PADDING = { top: 16, right: 22, bottom: 38, left: 72 };
const CURRENCY = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatCompactCurrency(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `£${(value / 1_000_000).toFixed(1)}m`;
  }
  if (Math.abs(value) >= 10_000) {
    return `£${Math.round(value / 1_000)}k`;
  }
  if (Math.abs(value) >= 1_000) {
    return `£${(value / 1_000).toFixed(1)}k`;
  }
  return CURRENCY.format(value);
}

export function CalculatorLineChart({
  description,
  series,
  xLabels,
}: CalculatorLineChartProps) {
  const values = series.flatMap((line) => line.values).filter(Number.isFinite);
  if (!values.length) {
    return null;
  }

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(1, ...values);
  const y = (value: number) =>
    PADDING.top + plotHeight - ((value - minimum) / (maximum - minimum)) * plotHeight;

  return (
    <div className="mt-6 border-t-2 border-slate-950 bg-white p-3 sm:p-5">
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2">
        {series.map((line) => (
          <p key={line.label} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span aria-hidden="true" className="h-1 w-5" style={{ backgroundColor: line.color }} />
            {line.label}
          </p>
        ))}
      </div>
      <svg
        className="block h-auto w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={description}
      >
        {[0, 0.5, 1].map((fraction) => {
          const value = minimum + (maximum - minimum) * (1 - fraction);
          const lineY = PADDING.top + plotHeight * fraction;
          return (
            <g key={fraction}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={lineY}
                y2={lineY}
                stroke="#d5d9d2"
                strokeWidth="1"
              />
              <text
                x={PADDING.left - 8}
                y={lineY + 4}
                textAnchor="end"
                fill="#65736a"
                fontSize="11"
              >
                {formatCompactCurrency(value)}
              </text>
            </g>
          );
        })}
        {series.map((line) => {
          const path = line.values
            .map((value, index) => {
              const x =
                PADDING.left +
                (index / Math.max(line.values.length - 1, 1)) * plotWidth;
              return `${index === 0 ? "M" : "L"} ${x} ${y(value)}`;
            })
            .join(" ");
          return (
            <path
              key={line.label}
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
        {xLabels.map((label, index) => {
          const x = PADDING.left + (index / 2) * plotWidth;
          return (
            <text
              key={`${label}-${index}`}
              x={x}
              y={HEIGHT - 10}
              textAnchor={index === 0 ? "start" : index === 2 ? "end" : "middle"}
              fill="#65736a"
              fontSize="11"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
