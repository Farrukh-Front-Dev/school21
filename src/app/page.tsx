"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import Particles from "@/app/components/Particles";
import TrueFocus from "./components/TrueFocus";
import { supabase } from "@/lib/supabase";
import AddUserModal from "./components/AddUserModal";
import { UserPlus } from "lucide-react";

type User = {
  nickname: string;
  name: string;
  phone: string;
  avatar_url?: string;
  tribe?: string;
};

async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }
  return data as User[];
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.nickname.toLowerCase().includes(s)
      )
    );
  }, [search, users]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🔵 Particle background */}
      <div className="absolute inset-0 -z-10 bg-black">
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

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-4xl sm:text-5xl font-bold mb-10 text-center drop-shadow-lg">
          <TrueFocus
            sentence="School21 Directory"
            manualMode={false}
            blurAmount={5}
            borderColor="green"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>

        {/* Add User Modal Button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-gradient-to-br from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add Me
        </button>
        {showModal && <AddUserModal onClose={() => setShowModal(false)} />}

        {/* Search Input */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Qidirish: nickname yoki ism..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-4 py-3 rounded-xl shadow-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-green-400 transition duration-300"
          />
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="text-2xl text-white" />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filtered.map((user) => (
            <Link
              key={user.nickname}
              href={`/profile/${user.nickname}`}
              className="group bg-white/10 backdrop-blur-3xl p-4 rounded-xl shadow-xl border border-white/20 hover:border-green-500 hover:bg-white/20 transition-all duration-300 flex flex-col items-center hover:scale-105"
            >
              <div className="w-24 h-24 mb-4 relative">
                <Image
                  src={user.avatar_url || "/avatars/school21.jpg"}
                  alt={user.nickname}
                  fill
                  sizes="96px"
                  className="rounded-full border-1 border-green-500 shadow-lg object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-1 text-white drop-shadow-lg">
                {user.nickname}
              </h2>
              {/* <p className="text-sm text-white/80">{user.name}</p>
              {user.tribe && (
                <p className="text-xs text-white/60">{user.tribe}</p>
              )} */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
