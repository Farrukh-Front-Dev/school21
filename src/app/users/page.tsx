"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type User = {
  id: string;
  nickname: string;
  name?: string;
  phone: string;
  tribe: string;
  avatar_url?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Xatolik:", error.message);
      } else {
        setUsers(data || []);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">School 21 Talabalari</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded-xl shadow-md text-center bg-white text-black"
          >
            <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden">
              <Image
                src={user.avatar_url || "/default-avatar.jpg"}
                alt={user.nickname}
                fill
                sizes="96px" // 👈 rasm o‘lchami bilan mos
                className="object-cover"
              />
            </div>
            <h2 className="text-xl mt-4 font-semibold">{user.nickname}</h2>
            <p className="text-gray-700">{user.name || "Ism yoʻq"}</p>
            <p className="text-sm text-gray-500">{user.phone}</p>
            <p className="text-sm text-gray-400">{user.tribe}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
