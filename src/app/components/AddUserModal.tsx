'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  onClose: () => void;
};

export default function AddUserModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    nickname: '',
    name: '',
    phone: '',
    tribe: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Iltimos, rasm tanlang.');
      return;
    }

    setLoading(true);

    try {
      const cleanedFileName = file.name.replace(/\s+/g, '-');
      const fileName = `${Date.now()}_${cleanedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        throw new Error('Rasm yuklanmadi: ' + uploadError.message);
      }

      const avatar_url = `https://rdwloaqrgzbczanwfqso.supabase.co/storage/v1/object/public/avatars/${fileName}`;

      const { error: insertError } = await supabase.from('users').insert([
        {
          ...formData,
          avatar_url,
        },
      ]);

      if (insertError) {
        console.error(insertError);
        throw new Error('Ma’lumotlar bazasiga yozilmadi: ' + insertError.message);
      }

      alert('✅ Ma’lumotlar saqlandi!');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('❌ Xatolik: ' + err.message);
      } else {
        alert('❌ Xatolik: Nomaʼlum xato yuz berdi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">
          O‘z ma’lumotlaringizni kiriting
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nickname"
            placeholder="Nickname (unikal)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            onChange={handleChange}
            required
          />
          <input
            name="name"
            placeholder="To‘liq ism"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Telefon raqam"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            onChange={handleChange}
            required
          />
          <select
            name="tribe"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            onChange={handleChange}
            required
          >
            <option value="">-- Tribe-ni tanlang --</option>
            <option value="HUMO">HUMO</option>
            <option value="TUYA">TUYA</option>
            <option value="LOCHIN">LOCHIN</option>
            <option value="BORI">BORI</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              {loading ? 'Yuklanmoqda...' : 'Yuborish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
