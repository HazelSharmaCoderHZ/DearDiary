"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseconfig";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "react-calendar/dist/Calendar.css";
import "react-calendar";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function MoodMapPage() {
  const { currentUser } = useAuth();
  const [value, setValue] = useState(new Date());
  const [moods, setMoods] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    async function fetchMoods() {
      try {
        const moodsCollection = collection(db, "moods", currentUser.uid, "moods");
        const snap = await getDocs(moodsCollection);
        const moodsObj = {};
        snap.forEach((doc) => {
          moodsObj[doc.id] = doc.data().mood;
        });
        setMoods(moodsObj);
      } catch (e) {
        console.error("Error fetching moods:", e);
      } finally {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
      }
    }
    fetchMoods();
  }, [currentUser]);

  const Loader3 = () => (
    <div className="min-h-screen flex justify-center items-center bg-[#ddbb9f]">
      <div className="loader3 mx-2"></div>
      <div className="loader3 mx-2"></div>
      <div className="loader3 mx-2"></div>
    </div>
  );

  const handleMood = async (mood) => {
    if (!selectedDate || !currentUser) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const moodRef = doc(db, "moods", currentUser.uid, "moods", dateStr);
    await setDoc(moodRef, { mood });
    setMoods((prev) => ({ ...prev, [dateStr]: mood }));
    setShowModal(false);
  };

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  };

  const getTileClass = ({ date, view }) => {
    if (view !== "month") return "";
    const dateStr = formatDate(date);
    const mood = moods[dateStr];
    if (mood === "good") return "mood-good transition-all duration-300 transform scale-90 rounded-2xl";
    if (mood === "average") return "mood-average transition-all duration-300 transform scale-90 rounded-2xl";
    if (mood === "bad") return "mood-bad transition-all duration-300 transform scale-90 rounded-2xl";
    return "hover:bg-purple-100/20 transition-colors rounded-2xl text-slate-700";
  };

  if (isLoading) return <Loader3 />;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* 🔮 Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        {/* Top Blob */}
        <img 
          src="blob.png" 
          alt="" 
          className="absolute w-full h-full opacity-40 "
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 z-10"
      >
        <h1 className="text-4xl md:text-5xl  tracking-tight text-fuchsia-400">
          Your <span className="text-fuchsia-900">MoodMap</span>
        </h1>
        <p className="text-slate-700 mt-2 font-medium italic">Visualize your emotional journey through time.</p>
      </motion.div>

      {/* Calendar Container - Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white backdrop-blur-3xl p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 relative z-10"
      >
        <Calendar
          key={Object.keys(moods).join("-")} 
          locale="en-GB"
          onChange={setValue}
          value={value}
          onClickDay={(date) => {
            setSelectedDate(date);
            setShowModal(true);
          }}
          tileClassName={getTileClass}
          className="main-calendar-override"
        />

        {/* Legend */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-blue">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"></span> Good</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047]"></span> Neutral</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_10px_#f87171]"></span> Tough</div>
        </div>
      </motion.div>

      {/* Mood Selector Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-sm text-slate-500">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-black">
              Daily Pulse
            </DialogTitle>
            <p className="text-center text-black text-sm">How was {selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}?</p>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-6">
            <Button 
              onClick={() => handleMood("good")} 
              className="py-7 rounded-2xl bg-green-500/60 text-slate-500 hover:bg-green-500/20 border border-green-500/20 transition-all text-lg font-bold"
            >
              😊 Vibrant & Good
            </Button>
            <Button 
              onClick={() => handleMood("average")} 
              className="py-7 rounded-2xl bg-yellow-500/60 text-slate-500 hover:bg-yellow-500/20 border border-yellow-500/20 transition-all text-lg font-bold"
            >
              😐 Just Fine
            </Button>
            <Button 
              onClick={() => handleMood("bad")} 
              className="py-7 rounded-2xl bg-red-500/60 text-slate-500 hover:bg-red-500/20 border border-red-500/20 transition-all text-lg font-bold"
            >
              ☹️ A Bit Tough
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Back Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button
          onClick={() => router.push('/dashboard')}
          className="mt-12 bg-transparent text-purple-500 hover:text-fuchsia-400 hover:bg-white/5 px-8 py-6 rounded-2xl border border-white/10 transition-all font-bold uppercase tracking-widest text-xs"
        >
          ← Return to Dashboard
        </Button>
      </motion.div>

      <style jsx global>{`
        .react-calendar {
          border: none !important;
          background: transparent !important;
          font-family: inherit !important;
          width: 100% !important;
          max-width: 400px;
          color: white !important;
        }
        .react-calendar__tile {
          padding: 1.5em 0.5em !important;
          font-weight: 600 !important;
        }
        .react-calendar__navigation button {
          font-weight: 800 !important;
          font-size: 1.2rem !important;
          color: white !important;
        }
        .react-calendar__navigation button:hover {
          background-color: rgba(11, 11, 11, 0.1) !important;
          border-radius: 12px;
        }
        .react-calendar__month-view__weekdays {
          color: rgba(11, 11, 11, 0.5) !important;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 800;
        }
        .mood-good { background: #4ade80 !important; color: #064e3b !important; box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4); }
        .mood-average { background: #fde047 !important; color: #713f12 !important; box-shadow: 0 4px 15px rgba(253, 224, 71, 0.4); }
        .mood-bad { background: #f87171 !important; color: #7f1d1d !important; box-shadow: 0 4px 15px rgba(248, 113, 113, 0.4); }
        
        .react-calendar__tile--now { background: rgba(255,255,255,0.1) !important; border-radius: 16px; }
        .react-calendar__tile--active { background: #d8b4fe !important; color: #4a148c !important; border-radius: 16px; }
      `}</style>
    </div>
  );
}