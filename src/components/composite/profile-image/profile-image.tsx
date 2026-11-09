import Image from "next/image";
import portrait from "../../../../public/images/yuanyizun-avatar.png";

export function ProfileImage() {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-card">
      <Image
        src={portrait}
        alt="Yizun Yuan"
        fill
        sizes="(min-width: 64rem) 18rem, min(20rem, calc(100vw - 2 * clamp(1rem, 6.15vw, 5rem)))"
        placeholder="blur"
        loading="eager"
        className="object-cover grayscale"
      />
    </div>
  );
}
