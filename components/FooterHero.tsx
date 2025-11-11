type FooterHeroProps = {
  themeColor?: string;
};

export default function FooterHero({ themeColor }: FooterHeroProps) {
  const textColor = themeColor || "inherit";
  
  return (
    <div className="mt-36 text-center" style={{ color: textColor }}>
      <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center">
        piqued your interest?
      </h2>
      <span className="block mt-4 text-xl">{"there's more..."}</span>
    </div>
  );
}
