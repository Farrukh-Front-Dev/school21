'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, UserPlus, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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

    if (!file) {
      toast.error('Iltimos, rasm tanlang.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Faqat rasm faylini tanlang!');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast(
        () => (
          <span>
            Rasm 2MB dan katta. <br />
            <strong>Tavsiya:</strong> Telegramʼda “Saqlangan xabarlar”ga yuboring, u yerdan
            qayta yuklang — hajmi kichrayadi.
          </span>
        ),
        { duration: 9000 }
      );
      return;
    }

    setLoading(true);

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const cleanedFileName = file.name.replace(/\s+/g, '-');
      const fileName = `${Date.now()}_${cleanedFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedFile);

      if (uploadError) throw new Error(uploadError.message);

      const avatar_url = `https://rdwloaqrgzbczanwfqso.supabase.co/storage/v1/object/public/avatars/${fileName}`;

      const { error: insertError } = await supabase
        .from('users')
        .insert([{ ...formData, phone: `+998${formData.phone}`, avatar_url }]);

      if (insertError) throw new Error(insertError.message);

      toast.success('✅ Maʼlumotlar saqlandi!');
      setFormData({ nickname: '', name: '', phone: '', tribe: '' });
      setFile(null);
      onClose();
    } catch (err) {
      toast.error(`❌ Xatolik: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`bg-white/30 w-full max-w-lg rounded-2xl p-6 shadow-xl relative transition-opacity duration-300 ${
          loading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Modalni yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <UserPlus className="w-6 h-6 text-green-600" /> Yangi foydalanuvchi
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 backdrop-blur-2xl rounded-2xl p-4">
          <input
            name="nickname"
            placeholder="school21 nickname"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            maxLength={30}
            pattern="^[\w\d_]{3,}$"
            title="Faqat harflar, raqamlar yoki _ bo'lishi mumkin (kamida 3 ta belgi)"
            onChange={handleChange}
            value={formData.nickname}
            required
          />
          <input
            name="name"
            placeholder="To‘liq ism"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            maxLength={50}
            onChange={handleChange}
            value={formData.name}
            required
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100">
              +998
            </span>
            <input
              type="tel"
              name="phone"
              placeholder="901234567"
              className="w-full pl-14 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              pattern="^\d{9}$"
              maxLength={9}
              title="Faqat 9 ta raqam: 901234567"
              onChange={handleChange}
              value={formData.phone}
              required
            />
          </div>

          {/* Tribe select */}
          <select
            name="tribe"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
            value={formData.tribe}
            required
          >
            <option value="">-- Tribe-ni tanlang --</option>
            <option className='bg-purple-600' value="HUMO">HUMO</option>
            <option className='bg-yellow-500' value="TUYA">TUYA</option>
            <option className='bg-red-500' value="LOCHIN">LOCHIN</option>
            <option className='bg-green-500' value="BORI">BORI</option>
          </select>

          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
            required
          />

          {/* File preview */}
          {file && (
            <div className="text-xs text-gray-500 mt-1">
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                width={96}
                height={96}
                className="mt-2 w-24 h-24 object-cover rounded border"
                style={{ width: '96px', height: '96px' }}
                unoptimized
              />
            </div>
          )}

          {/* Buttons */}
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
              className={`bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Yuborish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
