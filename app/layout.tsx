import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vynex Agenda",
  description: "Beauty professional scheduling & management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-[#f0ebe3]">
        <div className="max-w-md mx-auto min-h-screen bg-ivory shadow-2xl relative pb-20">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
