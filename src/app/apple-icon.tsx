import { siteName } from "@/utils/site-url";
import { shareImage } from "@/utils/share-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return shareImage({
    title: siteName,
    width: size.width,
    height: size.height,
  });
}
