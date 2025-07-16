'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/app/components/ProfileCard';
import Particles from '@/app/components/Particles';

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
  // React.use() bilan Promise ni unwrap qilamiz
  const { nickname } = React.use(params);

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

  if (loading) return <div className="text-white text-center mt-20">⏳ Yuklanmoqda...</div>;
  if (!user) return notFound();

  return (
    <div className="relative w-full min-h-screen bg-black flex items-center justify-center overflow-hidden">
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

      <div className="relative z-10 p-6">
        <ProfileCard
          name={user.fullname || user.name || 'No Name'}
          title="School 21 Talabasi"
          handle={user.nickname}
          status={`Tribe: ${user.tribe}`}
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
