'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseconfig';
import { motion } from "framer-motion";

export default function SavedPage() {
  const router = useRouter();

  const logout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="thirdpageanim relative overflow-hidden">
     <div className="min-h-screen flex flex-col items-center justify-center  text-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full border-3 border-purple-300">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">🎉 Note Saved!</h1>
        <p className="text-lg text-gray-700 mb-8">Your thoughts for the day have been safely stored.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={goToDashboard}
            className="bg-purple-600 hover:bg-purple-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md"
          >
            🏠 Go to Dashboard
          </button>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-800  text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md"
          >
            🔒 Logout & Home
          </button>
        </div>
       </div>
      </div>
    </div>
  );
}
