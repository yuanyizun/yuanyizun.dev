"use client";

function chipClass(selected: boolean) {
  return `inline-flex min-h-11 items-center rounded-md px-3 text-sm transition-colors ${
    selected
      ? "bg-primary text-primary-foreground focus-visible:outline-primary-foreground"
      : "bg-card text-foreground"
  }`;
}

export function TypeFilter({
  types,
  selected,
  onChange,
}: {
  types: string[];
  selected: string[];
  onChange: (types: string[]) => void;
}) {
  const allSelected = selected.length === 0;

  function toggle(type: string) {
    if (allSelected) {
      onChange([type]);
      return;
    }

    const next = selected.includes(type)
      ? selected.filter((item) => item !== type)
      : [...selected, type];

    onChange(next.length === types.length ? [] : next);
  }

  return (
    <div role="group" aria-label="Project types" className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={allSelected}
        onClick={() => onChange([])}
        className={chipClass(allSelected)}
      >
        All
      </button>
      {types.map((type) => {
        const pressed = !allSelected && selected.includes(type);
        return (
          <button
            key={type}
            type="button"
            aria-pressed={pressed}
            onClick={() => toggle(type)}
            className={chipClass(pressed)}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
