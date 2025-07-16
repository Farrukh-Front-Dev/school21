'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, UserPlus, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

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
    if (!file) return alert('Iltimos, rasm tanlang.');
    setLoading(true);

    try {
      const cleanedFileName = file.name.replace(/\s+/g, '-');
      const fileName = `${Date.now()}_${cleanedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw new Error('Rasm yuklanmadi.');

      const avatar_url = `https://rdwloaqrgzbczanwfqso.supabase.co/storage/v1/object/public/avatars/${fileName}`;

      const { error: insertError } = await supabase.from('users').insert([
        { ...formData, avatar_url },
      ]);

      if (insertError) throw new Error('Maʼlumotlar bazasiga yozilmadi.');

      alert('✅ Maʼlumotlar saqlandi!');
      onClose();
    } catch (err) {
      alert(`❌ Xatolik: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white text-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <UserPlus className="w-6 h-6 text-green-600" /> Yangi foydalanuvchi
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nickname"
            placeholder="@nickname (unikal)"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            name="name"
            placeholder="To‘liq ism"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Telefon raqam"
            className="input"
            onChange={handleChange}
            required
          />
          <select
            name="tribe"
            className="input"
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
            className="input cursor-pointer"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-md hover:underline"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}