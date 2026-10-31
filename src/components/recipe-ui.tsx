export function RecipeUi() {
  return (
    <div
      data-ui
      className="grid gap-3 bg-surface p-4 text-[0.8125rem] text-foreground sm:grid-cols-[1.1fr_0.9fr]"
      aria-label="Recipe manager interface fragment"
    >
      <div className="flex flex-col gap-3 bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold tracking-[-0.02em]">Recipe Manager</p>
          <span className="bg-foreground px-2 py-1 text-[0.7rem] font-semibold text-background">
            Personal
          </span>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">Search</span>
          <span className="bg-surface px-3 py-2 text-foreground/80">
            tomato, weeknight, pasta
          </span>
        </label>
        <ul className="flex flex-col gap-2">
          {["Tomato and basil pasta", "Chicken stock", "Friday meal prep"].map(
            (item) => (
              <li
                key={item}
                className="flex items-center justify-between gap-3 bg-surface px-3 py-2"
              >
                <span>{item}</span>
                <span className="text-foreground/80">saved</span>
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold tracking-[-0.02em]">Weekly plan</p>
          <span className="text-foreground/80">Theme: light</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Mon", "Stock pot"],
            ["Tue", "Pasta"],
            ["Wed", "Leftovers"],
            ["Thu", "Soup"],
            ["Fri", "Meal prep"],
            ["Sat", "Open"],
          ].map(([day, meal]) => (
            <div key={day} className="bg-surface px-3 py-2">
              <p className="text-muted-foreground">{day}</p>
              <p className="font-semibold tracking-[-0.02em]">{meal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
