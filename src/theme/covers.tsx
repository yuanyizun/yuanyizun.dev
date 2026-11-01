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

const PROFILE_SRC = "/images/yuanyizun-avatar.png";

export function ProfileImage() {
  return (
    <div className="aspect-square w-full overflow-hidden bg-card">
      <img
        src={PROFILE_SRC}
        alt="Yizun Yuan"
        width={577}
        height={577}
        className="size-full object-cover grayscale"
      />
    </div>
  );
}

export function BrowserPreview({
  title,
  tone = "light",
}: {
  title: string;
  tone?: "light" | "dark";
}) {
  const ink = tone === "dark" ? "#F7F5F0" : "#242823";
  const panel = tone === "dark" ? "#313830" : "#F7F5F0";
  const line = tone === "dark" ? "#C7CEC1" : "#646B60";

  return (
    <svg viewBox="0 0 640 400" role="img" aria-label={`${title} conceptual preview`} className="h-full w-full">
      <rect width="640" height="400" fill={tone === "dark" ? "#252C24" : "#EAEDE3"} />
      <rect x="28" y="28" width="584" height="344" rx="12" fill={panel} />
      <circle cx="56" cy="56" r="5" fill={line} />
      <circle cx="74" cy="56" r="5" fill={line} />
      <circle cx="92" cy="56" r="5" fill={line} />
      <text
        x="56"
        y="130"
        fill={ink}
        fontFamily="var(--font-newsreader), Georgia, serif"
        fontSize="34"
      >
        {title.length > 28 ? `${title.slice(0, 26)}…` : title}
      </text>
      <rect x="56" y="160" width="180" height="10" rx="5" fill={line} opacity="0.45" />
      <rect x="56" y="182" width="240" height="10" rx="5" fill={line} opacity="0.3" />
      <rect x="56" y="230" width="120" height="36" rx="8" fill="#BB4B2C" />
      <rect x="360" y="150" width="200" height="150" rx="10" fill="#EAEDE3" />
      <circle cx="460" cy="214" r="28" fill="#BB4B2C" />
    </svg>
  );
}
