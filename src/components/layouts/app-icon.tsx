import Image from "next/image";

export const AppIcon = ({ size = 32 }: { size?: number }) => {
  return (
    <Image
      quality={100}
      src="/icons/pagoda_navicon.png"
      width={size}
      height={size}
      alt="app icon"
      className="rounded-full"
    />
  );
};
