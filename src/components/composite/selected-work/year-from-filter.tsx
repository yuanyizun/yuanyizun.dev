"use client";

export function YearFromFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (fromYear: number) => void;
}) {
  const years: number[] = [];
  for (let year = min; year <= max; year += 1) {
    years.push(year);
  }

  return (
    <label className="flex min-w-0 max-w-xs flex-col gap-2">
      <span className="font-mono text-xs text-muted-foreground">From</span>
      <select
        value={value}
        disabled={min === max}
        aria-label="From year"
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-base disabled:opacity-60"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  );
}
