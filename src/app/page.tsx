"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import TrueFocus from "./components/TrueFocus";
import { supabase } from "@/lib/supabase";
import AddUserModal from "./components/AddUserModal";
import { UserPlus } from "lucide-react";
import ResponsiveBackground from "./components/ResponsiveBackground";
import LoadingHourglass from "./components/LoadingHourGlass"; // NEW animated loader

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
      setFiltered(data);
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingHourglass />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <ResponsiveBackground />

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-gradient-to-br from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <UserPlus className="w-5 h-5" />
        Add Me
      </button>
      {showModal && <AddUserModal onClose={() => setShowModal(false)} />}

      <main className="max-w-screen-xl mx-auto px-4 pt-6 pb-20">
        <div className="sticky top-2 z-30 backdrop-blur-md rounded-xl shadow-md px-4 py-3 mb-8 max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Qidirish: nickname yoki ism..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-xl text-white" />
            </div>
          </div>
        </div>

        <div className="text-4xl sm:text-5xl font-bold mb-10 text-center drop-shadow-lg">
          <TrueFocus
            sentence="Studentlink Web App"
            manualMode={false}
            blurAmount={5}
            borderColor="green"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.map((user, idx) => (
            <Link
              key={user.nickname}
              href={`/profile/${user.nickname}`}
              className="group bg-white/10 backdrop-blur-2xl p-4 rounded-xl shadow-md border border-white/10 hover:border-green-500 hover:bg-white/20 transition-all duration-300 flex flex-col items-center hover:scale-105"
            >
              <div className="w-24 h-24 mb-3 relative">
                <Image
                  src={user.avatar_url || "/avatars/school21.jpg"}
                  alt={user.nickname}
                  fill
                  sizes="96px"
                  className="rounded-full border border-green-400 shadow-md object-cover"
                  priority={idx < 5}
                  // loading="lazy"
                  placeholder="blur"
                  blurDataURL="/blur.avif"
                />
              </div>
              <h2 className="text-lg font-semibold text-white drop-shadow">
                {user.nickname}
              </h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
