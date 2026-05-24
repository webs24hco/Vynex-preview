import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { LanguageProvider } from "@/context/LanguageContext";

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
      <body className="min-h-screen">
        <LanguageProvider>
          <div className="max-w-md mx-auto min-h-screen bg-ivory/60 backdrop-blur-sm shadow-2xl relative pb-24">
            {children}
            <BottomNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
