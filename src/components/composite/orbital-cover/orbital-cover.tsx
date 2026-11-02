export function OrbitalCover({ title }: { title: string }) {
  return (
    <svg
      viewBox="0 0 560 420"
      role="img"
      aria-label={title}
      className="h-full w-full"
    >
      <rect width="560" height="420" fill="#EAEDE3" />
      <ellipse
        cx="292"
        cy="214"
        rx="168"
        ry="78"
        fill="none"
        stroke="#242823"
        strokeWidth="1.6"
      />
      <ellipse
        cx="292"
        cy="214"
        rx="112"
        ry="132"
        fill="none"
        stroke="#242823"
        strokeWidth="1.6"
        transform="rotate(-24 292 214)"
      />
      <ellipse
        cx="292"
        cy="214"
        rx="150"
        ry="46"
        fill="none"
        stroke="#646B60"
        strokeWidth="1.4"
        transform="rotate(32 292 214)"
      />
      <circle cx="292" cy="214" r="42" fill="#BB4B2C" />
      <circle cx="430" cy="168" r="5" fill="#242823" />
      <circle cx="168" cy="250" r="4" fill="#242823" />
      <text
        x="36"
        y="372"
        fill="#646B60"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontSize="13"
      >
        Sydney · publishing systems
      </text>
    </svg>
  );
}
