'use client';

import React, { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/app/components/ProfileCard';
import Particles from '@/app/components/Particles';
import Loading from '@/app/components/Loading';

type Params = {
  nickname: string;
};

type Props = {
  params: Promise<Params>;
};

type User = {
  nickname: string;
  fullname?: string;
  name?: string;
  phone: string;
  tribe: string;
  avatar_url?: string;
};

export default function ProfilePage({ params }: Props) {
  const { nickname } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nickname', nickname.toLowerCase())
        .single();

      if (error || !data) {
        console.error('User not found:', error?.message);
        setUser(null);
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    getUser();
  }, [nickname]);

  if (loading) return <Loading />;
  if (!user) return notFound();

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Desktopda: Particles */}
      <div className="hidden sm:block absolute top-0 left-0 w-full h-full z-0">
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

      {/* Mobilda: gradient fon */}
      <div className="block sm:hidden absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      <div className="relative z-10 w-full min-h-screen overflow-y-auto flex items-center justify-center px-4 py-10 sm:py-16">
        <ProfileCard
          name={user.name || 'No Name'}
          title=""
          handle={user.nickname}
          status={`${user.tribe}`}
          contactText={user.phone}
          avatarUrl={user.avatar_url || '/school21.jpg'}
          showUserInfo={true}
          enableTilt={true}
          onContactClick={() => window.open(`tel:${user.phone}`, '_blank')}
        />
      </div>
    </div>
  );
}
