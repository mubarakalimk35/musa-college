import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "./components/ConditionalHeader";
import ChatBot from "./components/ChatBot"; // direct import

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: "swap"
});
const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Govt. General Muhammad Musa Postgraduate College Quetta",
  description: "Official Website of Govt. General Muhammad Musa Postgraduate College Quetta - Admissions, Programs, Faculty, Gallery",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <ConditionalHeader />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}