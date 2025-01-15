// import Link from "next/link";
// import getTextsMap from "./utils/GetTextsMap";

export const siteTitle = "nheek";

export default function Header({ customHeaderText = "" }) {
  return (
    <header className="flex items-center justify-center pt-8">
      <div className="w-[45%] text-4xl text-center">{customHeaderText}</div>
    </header>
  );
}
