"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Icon kutubxonasini o'rnatib foydalanamiz
import { FiSearch } from 'react-icons/fi';

type User = {
  nickname: string;
  name: string;
  phone: string;
  photo: string;
};

async function getUsers(): Promise<User[]> {
  const res = await fetch("/data/users.json");
  return res.json();
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white px-6 py-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-center drop-shadow-lg text-gradient">
          School21 Directory
        </h1>

        {/* Qidiruv */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <input
            type="text"
            placeholder="🔍 Qidirish: nickname yoki ism..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-4 py-3 rounded-xl shadow-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          />
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="text-2xl text-white" />
          </div>
        </div>

        {/* Userlar grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filtered.map((user) => (
            <Link
              key={user.nickname}
              href={`/profile/${user.nickname}`}
              className="group bg-white/10 backdrop-blur-3xl p-4 rounded-xl shadow-xl border border-white/20 hover:border-blue-500 hover:bg-white/20 transition-all duration-300 flex flex-col items-center hover:scale-105"
            >
              <div className="w-24 h-24 mb-4 relative">
                <Image
                  src={`/avatars/${user.photo}`}
                  alt={user.nickname}
                  fill
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-white drop-shadow-lg">{user.nickname}</h2>
              <p className="text-sm text-gray-300">{user.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
