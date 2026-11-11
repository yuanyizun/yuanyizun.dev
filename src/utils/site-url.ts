export const siteName = "Yizun Yuan";

export const siteDescription =
  "Senior full stack and platform engineer in Sydney. Production systems for a digital media business.";

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
}
