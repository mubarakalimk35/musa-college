import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NoticeTicker from "./components/NoticeTicker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Govt. General Muhammad Musa Postgraduate College Quetta",
  description: "Official Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Notice Ticker - Har page par ayega */}
        <div className="sticky top-0 z-[100]">
          <NoticeTicker />
        </div>
        {children}
      </body>
    </html>
  );
}