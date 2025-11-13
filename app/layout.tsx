import "../styles/global.css";
import { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nheek.com"),
  title: {
    default: "nheek - fullstack developer | songwriter",
    template: "%s | nheek",
  },
  description:
    "fullstack developer & songwriter. my code breathes life into applications. my lyrics breathe life into emotions.",
  keywords: [
    "nheek",
    "fullstack developer",
    "songwriter",
    "web developer",
    "portfolio",
    "music",
    "lyrics",
  ],
  authors: [{ name: "nheek" }],
  creator: "nheek",
  publisher: "nheek",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.nheek.com",
    siteName: "nheek",
    title: "nheek - fullstack developer | songwriter",
    description:
      "fullstack developer & songwriter. my code breathes life into applications. my lyrics breathe life into emotions.",
    images: [
      {
        url: "https://flies.nheek.com/uploads/nheek/pfp/pfp",
        width: 1200,
        height: 1200,
        alt: "nheek profile picture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nheek - fullstack developer | songwriter",
    description:
      "fullstack developer & songwriter. my code breathes life into applications. my lyrics breathe life into emotions.",
    creator: "@nick.mmrdl",
    images: ["https://flies.nheek.com/uploads/nheek/pfp/pfp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
  <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
