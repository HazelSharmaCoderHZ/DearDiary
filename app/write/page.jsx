'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/firebaseconfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function WritePage() {
  const [note, setNote] = useState('');
  const [userId, setUserId] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-IN', { weekday: 'long' });
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleDateString('en-IN', { month: 'long' });
    const year = today.getFullYear();
    setFormattedDate(`${weekday}, ${day} ${month} ${year}`);
  }, []);

  const saveNote = async () => {
    if (!note.trim()) return alert('The page is waiting for your words...');
    setIsSaving(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      const notesRef = collection(db, 'users', userId, 'notes'); 
      await addDoc(notesRef, {
        note,
        date: today,
        timestamp: serverTimestamp(), 
      });
      setShowSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#96897e] via-purple-50 to-[#96897e] flex flex-col items-center pt-12 px-6 relative overflow-hidden">
      
      {/* 🌌 Atmospheric Background */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-100/40 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-fuchsia-100/30 blur-[100px] -z-10 rounded-full" />

      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex justify-between items-center mb-12"
      >
        <Link href="/dashboard" className="text-slate-700 hover:text-[#1e1616] transition-colors font-semibold flex items-center gap-2">
          <span>←</span> Dashboard
        </Link>
        <div className="text-right">
          <p className="text-[#1e1616] font-bold tracking-tight">{formattedDate}</p>
          <p className="text-xs text-slate-800 uppercase tracking-widest">Personal Sanctuary</p>
        </div>
      </motion.div>

      {/* 📖 The Notebook Paper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl bg-[#d9d2b8] rounded-[2rem] shadow-2xl shadow-purple-100/50 border border-purple-50 overflow-hidden"
      >
        {/* Notebook Spiral Decoration (Visual Detail) */}
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-slate-800 z-10" />
        
        <textarea
          autoFocus
          className="w-full h-[60vh] p-12 pt-16 md:p-16 text-slate-800 bg-transparent resize-none focus:outline-none text-xl leading-[2.2rem] font-serif placeholder:text-slate-500 z-20 relative"
          placeholder="Start typing your story..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            backgroundImage: 'linear-gradient(transparent, transparent 34px, #3e1f05ff 34px)',
            backgroundSize: '100% 35px',
          }}
        />

        {/* Floating Save Action */}
        <div className="absolute bottom-8 right-8 z-30">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveNote}
            disabled={isSaving}
            className={`px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-3 ${
              isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1e1616]'
            }`}
          >
            {isSaving ? 'Saving...' : '✨ Save Entry'}
          </motion.button>
        </div>
      </motion.div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4 text-slate-900">💜</div>
              <h2 className="text-3xl font-black text-slate-800">Entry Saved.</h2>
              <p className="text-slate-500 mt-2">Your thoughts are safe in the vault.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-8 text-slate-400 text-sm italic">
        The ink of the soul never fades.
      </footer>
    </div>
  );
}