"use client";

export function YearRangeFilter({
  min,
  max,
  from,
  to,
  onChange,
}: {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
}) {
  const singleYear = min === max;

  return (
    <div role="group" aria-label="Years" className="grid gap-5 sm:grid-cols-2">
      <label className="flex min-w-0 flex-col gap-2">
        <span className="flex items-baseline justify-between font-mono text-xs text-muted-foreground">
          <span>From</span>
          <span>{from}</span>
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={from}
          disabled={singleYear}
          aria-valuetext={String(from)}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Math.min(next, to), to);
          }}
          className="h-6 w-full accent-primary disabled:opacity-60"
        />
      </label>
      <label className="flex min-w-0 flex-col gap-2">
        <span className="flex items-baseline justify-between font-mono text-xs text-muted-foreground">
          <span>To</span>
          <span>{to}</span>
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={to}
          disabled={singleYear}
          aria-valuetext={String(to)}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(from, Math.max(next, from));
          }}
          className="h-6 w-full accent-primary disabled:opacity-60"
        />
      </label>
    </div>
  );
}
