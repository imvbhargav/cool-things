import type { Metadata } from "next";
import { Space_Grotesk, VT323 } from "next/font/google";
import "./globals.css";

const spaceSans = Space_Grotesk({
  variable: "--font-space-sans",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt-sans",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: 'CoolThings: Store',
  description: 'Site to discover and buy the coolest things.',
  icons: {
    icon: '/logo.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceSans.variable} ${vt323.variable} antialiased`}
      >
          {children}
      </body>
    </html>
  );
}