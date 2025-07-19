'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="relative mb-4">
        {/* Orqa fon blurli, katta belgisi */}
        <div className="absolute inset-0 blur-2xl opacity-20 animate-spin-medium">
          <span className="text-[120px] text-green-500 font-mono select-none">
            {'</>'}
          </span>
        </div>

        {/* Oldingi, animatsiyali belgisi */}
        <span className="text-[48px] text-green-400 font-mono animate-pulse-fade drop-shadow-lg select-none">
          {'</>'}
        </span>
      </div>

      <p className="text-lg font-semibold tracking-wide">Yuklanmoqda...</p>
    </div>
  );
}
