'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseconfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function EditNotesPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedText, setEditedText] = useState("");
  
  // Custom Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
        const notesRef = collection(db, "users", currentUser.uid, "notes");
        const snapshot = await getDocs(notesRef);
        const userNotes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedNotes = userNotes.sort((a, b) => 
          (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );
        setNotes(sortedNotes);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditedText(note.note);
  };

  const saveEdit = async (noteId) => {
    const noteRef = doc(db, "users", user.uid, "notes", noteId);
    await updateDoc(noteRef, { note: editedText });
    setNotes(notes.map(n => n.id === noteId ? { ...n, note: editedText } : n));
    setEditingNoteId(null);
    setEditedText("");
  };

  const triggerDeleteModal = (noteId) => {
    setNoteToDelete(noteId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    const noteRef = doc(db, "users", user.uid, "notes", noteToDelete);
    await deleteDoc(noteRef);
    setNotes(notes.filter((n) => n.id !== noteToDelete));
    setIsModalOpen(false);
    setNoteToDelete(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-purple-600 font-bold uppercase tracking-tighter">
      Preparing your archives...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden px-6 py-12 text-slate-900">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-purple-100/40 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-50/40 blur-[120px] -z-10 rounded-full" />

      {/* CUSTOM DELETE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                ⚠️
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Delete Entry?</h3>
              <p className="text-slate-500 mb-8">This memory will be removed from your vault forever. Are you sure?</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                >
                  Yes, Delete Forever
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  No, Keep It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <Link href="/dashboard" className="text-purple-600 font-bold text-xs uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2 mb-4">
          ← Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
          Manage <span className="text-purple-600">Archives</span>
        </h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <AnimatePresence>
          {notes.map((note, idx) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-50 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Memory Captured</p>
                    <p className="text-slate-700 font-bold">{note.date}</p>
                  </div>
                </div>
                
                {/* 1. Time Visibility Instead of ID */}
                <div className="text-[11px] font-bold text-purple-500 bg-purple-50/50 border border-purple-100 px-4 py-1.5 rounded-full w-fit">
                  ⏰ {note.timestamp?.toDate().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </div>

              {editingNoteId === note.id ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <textarea
                    className="w-full h-40 p-5 text-slate-800 bg-purple-50/30 border border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-lg leading-relaxed font-serif italic"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => saveEdit(note.id)} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-purple-600 transition-all">Save Changes</button>
                    <button onClick={() => setEditingNoteId(null)} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl">Cancel</button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8 font-serif italic italic text-pretty">
                    "{note.note}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                    <button
                      onClick={() => startEditing(note)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-purple-300 hover:text-purple-600 transition-all"
                    >
                      <span>✏️</span> Edit Entry
                    </button>
                    <button
                      onClick={() => triggerDeleteModal(note.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-red-400 hover:border-red-200 hover:bg-red-50 transition-all"
                    >
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="mt-20 py-10 text-center border-t border-slate-100">
        <p className="text-slate-300 text-xs font-bold uppercase tracking-[0.3em]">Dear Diary Vault</p>
      </footer>
    </div>
  );
}