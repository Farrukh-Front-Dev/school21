'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Particles komponentini faqat clientda yuklash (SSR off)
const Particles = dynamic(() => import('@/app/components/Particles'), { ssr: false });

export default function ResponsiveBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen(); // Mount paytida bir marta tekshiradi
    window.addEventListener('resize', checkScreen); // Window o‘zgarsa qaytadan tekshiradi

    return () => {
      window.removeEventListener('resize', checkScreen); // Memory leak oldini oladi
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      {isMobile ? (
        // Mobil qurilmalar uchun soddalashtirilgan fon
        <div className="w-full h-full bg-gradient-to-br from-[#1A1C22] via-[#3a3c4a] to-[#6c6e7b] opacity-90 backdrop-blur-sm" />
      ) : (
        // Desktop uchun chiroyli animatsiyali fon
        <div className="relative w-full h-full bg-gradient-to-br from-[#1A1C22] via-[#494a57] to-[#77798e] opacity-80">
          <Particles
            particleColors={['#0FFF20', '#0FFF19']}
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
