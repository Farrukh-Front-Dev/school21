'use client';

import * as React from 'react';
import users from '@/../public/data/users.json';
import { notFound } from 'next/navigation';
import ProfileCard from '@/app/components/ProfileCard';
import Particles from '@/app/components/Particles';

type Params = {
  nickname: string;
};

type Props = {
  params: Promise<Params>;
};

export default function ProfilePage({ params: paramsPromise }: Props) {
  const params = React.use(paramsPromise);
  const nickname = params.nickname.toLowerCase();

  const user = users.find((u) => u.nickname.toLowerCase() === nickname);
  if (!user) return notFound();

  return (
    <div className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* 🌌 Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Particles
          particleColors={['#0FFF10', '#0FFF10']}
          particleCount={400}
          particleSpread={10}
          speed={0.3}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* 👤 Profile card */}
      <div className="relative z-10 p-6">
        <ProfileCard
          name={user.name}
          title="School 21 Talabasi"
          handle={user.nickname}
          status="Tribe"
          contactText={user.phone}
          avatarUrl={`/avatars/${user.photo}`}
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() => window.open(`tel:${user.phone}`, '_blank')}
        />
      </div>
    </div>
  );
}
