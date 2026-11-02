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
