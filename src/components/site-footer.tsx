import Link from "next/link";

const credits = [
  {
    href: "https://commons.wikimedia.org/wiki/File:Sydney_Opera_House_and_Harbour_Bridge_Dusk_(2)_2019-06-21.jpg",
    label: "Sydney dusk",
    credit: "Benh LIEU SONG, CC BY-SA 4.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:Wharves_of_Darling_Harbour_and_Pyrmont,_Sydney,_1950s_(Graeme_Andrews_Working_Harbour_Collection,_City_of_Sydney_Archives).jpg",
    label: "Darling Harbour wharves",
    credit: "City of Sydney Archives, CC BY 4.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:Sydney_ferry_LADY_DENMAN_on_Sydney_Harbour_17_January_1972.jpg",
    label: "Lady Denman ferry",
    credit: "John Ward, CC BY 4.0",
  },
  {
    href: "https://commons.wikimedia.org/wiki/File:The_rotary_press_of_newspaper_Hufvudstadsbladet_1927_(Numeroimaton;_JOKAHBL3A_A01-19).tif",
    label: "Rotary press",
    credit: "CC BY 4.0, via Wikimedia Commons",
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="page-shell flex flex-col gap-8 pb-8 pt-16 sm:pt-24">
        <div className="grid gap-4 text-[0.875rem] sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <p className="text-muted-foreground">Yizun Yuan · Sydney</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-center">
            <Link href="/projects" className="no-underline">
              Work
            </Link>
            <Link href="/posts" className="no-underline">
              Notes
            </Link>
            <Link href="/about" className="no-underline">
              About
            </Link>
            <Link href="/contact" className="no-underline">
              Contact
            </Link>
          </nav>
          <p className="text-muted-foreground sm:text-right">2026</p>
        </div>
        <ul className="flex max-w-4xl flex-col gap-1 text-[0.8125rem] text-muted-foreground">
          {credits.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="no-underline">
                {item.label}
              </a>
              {` — ${item.credit}`}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
