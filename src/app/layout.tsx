import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Google Fonts ulanishi
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// SEO va metadata
export const metadata: Metadata = {
  title: "Studentlink", // Sahifa title
  description: "Created by rrangesi - A platform to connect students",
  icons: {
    icon: "/favicon.png", // Favicon fayli `public/` papkasida bo'lishi kerak
  },
};

// RootLayout komponenti
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Toast xabarnomalar */}
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Asosiy sahifa kontenti */}
        {children}
      </body>
    </html>
  );
}
