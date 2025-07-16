import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase rasm domenini qo‘shamiz
    domains: ["rdwloaqrgzbczanwfqso.supabase.co"],
    unoptimized: false, // rasmni optimizatsiya qilish uchun false bo'lishi kerak
  },
};

export default nextConfig;
