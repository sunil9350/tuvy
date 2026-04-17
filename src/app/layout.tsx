import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Tuvy — Kitchen tasks, done in 10 minutes",
  description:
    "Tidy + Utility for your kitchen. Quality tools that make chopping, spraying, and organizing effortless.",
  openGraph: {
    title: "Tuvy — Make kitchen easy in 10 minutes",
    description: "Kitchen tasks, done in 10 minutes. Shop chopper, sprayer, storage, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
