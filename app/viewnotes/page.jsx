'use client';

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseconfig";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ViewNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const notesCollectionRef = collection(db, "users", user.uid, "notes");
        const notesSnapshot = await getDocs(notesCollectionRef);
        const notesData = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedNotes = notesData.sort((a, b) =>
          (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );
        setNotes(sortedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-purple-600 font-medium tracking-widest uppercase text-xs">Unlocking Memories...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden px-6 py-12">
      
      {/* 🔮 Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/40 blur-[100px] -z-10 rounded-full" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="text-purple-600 font-bold text-sm uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2 mb-4">
            ← Back to Sanctuary
          </Link>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight">
            Past <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-500">Reflections</span>
          </h1>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-purple-100 shadow-sm">
          <p className="text-slate-500 font-medium">Total Entries: <span className="text-purple-600 font-bold">{notes.length}</span></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {notes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[3rem] border border-dashed border-purple-200"
          >
            <div className="text-6xl mb-6">🏜️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">The pages are empty</h2>
            <p className="text-slate-500 mb-8">Every great story needs a beginning.</p>
            <Link href="/write" className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-transform">
              Write Your First Note
            </Link>
          </motion.div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {notes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="break-inside-avoid relative group"
              >
                <div className="bg-white border border-purple-50 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 transform group-hover:scale-105">
                  
                  {/* Decorative element */}
                  <div className="absolute top-6 right-8 text-purple-100 text-4xl font-black select-none opacity-50 group-hover:opacity-100 transition-opacity">
                    {idx + 1}
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {note.date}
                    </span>
                  </div>

                  <p className="text-slate-700 text-lg leading-relaxed font-serif whitespace-pre-wrap mb-8 italic">
                    "{note.note}"
                  </p>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                      Stored in Vault
                    </span>
                    <span className="text-[10px] font-medium text-purple-400">
                      {note.timestamp?.toDate().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-20 text-center">
        <div className="h-[1px] w-24 bg-purple-100 mx-auto mb-6" />
        <p className="text-slate-400 text-sm italic tracking-wide">End of reflections</p>
      </footer>
    </div>
  );
}