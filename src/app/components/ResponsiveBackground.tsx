"use client";

import { useEffect, useState } from "react";
// import Particles from "@/app/components/Particles";
import dynamic from "next/dynamic";
const Particles = dynamic(() => import("@/app/components/Particles"), { ssr: false });

export default function ResponsiveBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {isMobile ? (
        <div className="w-full h-full bg-gradient-to-br from-[#1A1C22] via-[#5A5C6A] to-[#A7A8B2] opacity-80" />
      ) : (
        <div className="bg-gradient-to-br from-[#1A1C22] via-[#494a57] to-[#77798e] opacity-80 w-full h-full">
          <Particles
          particleColors={["#0FFF20", "#0FFF19"]}
          particleCount={400}
          particleSpread={10}
          speed={0.3}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
        </div>
      )}
    </div>
  );
}
