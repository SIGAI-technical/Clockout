import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Oswald } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clockout4.aiml.latveria"),
  title: "Clockout 4.0 — The Doom Takeover",
  description:
    "An interactive cinematic experience for Clockout 4.0. Enter Latveria's sovereign stronghold, stand before Doctor Doom's throne, and secure your access.",
  keywords: [
    "Clockout 4.0",
    "Doom Takeover",
    "AIML Department",
    "Latveria",
    "Tech Conclave",
    "Hackathon",
  ],
  authors: [{ name: "AIML Department" }],
  openGraph: {
    title: "Clockout 4.0 — The Doom Takeover",
    description:
      "Enter the fortress. Face the ruler. Clockout 4.0 begins at 2:00 PM onwards, 4th Floor, AIML Department.",
    images: [
      {
        url: "/images/v3_freeze_frame.jpg",
        width: 1920,
        height: 808,
        alt: "Doctor Doom on the Throne - Clockout 4.0",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#050605",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${oswald.variable} ${inter.variable} dark`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; } window.scrollTo(0, 0);`,
          }}
        />
      </head>
      <body className="bg-[#050605] text-[#F7F7F6] antialiased selection:bg-[#39D98A]/30 selection:text-[#39D98A] overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
