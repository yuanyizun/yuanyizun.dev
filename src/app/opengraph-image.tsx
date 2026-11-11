import { siteDescription, siteName } from "@/utils/site-url";
import { shareImage } from "@/utils/share-image";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage({
    title: siteName,
    summary: siteDescription,
    width: size.width,
    height: size.height,
  });
}
