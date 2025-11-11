type FooterProps = {
  themeColor?: string;
};

export default function Footer({ themeColor }: FooterProps) {
  const textColor = themeColor || "inherit";
  
  return (
    <footer className="w-[80%] mt-24 md:mt-36 text-center mx-auto pb-16" style={{ color: textColor }}>
      <p className="italic font-semibold">
        {"after thirty sunsets, the sunrise i dread"}
      </p>
    </footer>
  );
}
