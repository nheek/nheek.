import "../styles/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "nheek",
    template: "%s - nheek",
  },
  description: "Portfolio website of nheek",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "nheek",
    description: "Portfolio website of nheek",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "nheek",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "nheek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://trck.nheek.com/script.js"
          data-website-id="74e002f4-f2a6-43b6-9045-840f9632e53a"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
