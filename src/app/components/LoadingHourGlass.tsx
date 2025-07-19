'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1C22] via-[#3a3c4a] to-[#6c6e7b] opacity-90 backdrop-blur-sm text-white">
      <div className="relative mb-4 flex items-center justify-center">
        {/* Katta, blurli orqa fon belgisi */}
        <div className="absolute">
          <span className="text-[160px] text-lime-500 opacity-20 blur-3xl animate-spin-slow font-mono select-none">
            {'</>'}
          </span>
        </div>

        {/* O‘rtadagi, pulsatsiyali belgisi */}
        <span className="text-[64px] text-lime-400 animate-pulse-fade font-mono drop-shadow-lg select-none">
          {'</>'}
        </span>
      </div>

      <p className="text-lg font-semibold tracking-wide text-white">Yuklanmoqda...</p>
    </div>
  );
}
