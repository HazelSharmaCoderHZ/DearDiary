"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "react-calendar/dist/Calendar.css";
import "react-calendar";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

// 🔥 API BASE
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MoodMapPage() {
  const [value, setValue] = useState(new Date());
  const [moods, setMoods] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FETCH MOODS FROM BACKEND
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchMoods() {
      try {
        const res = await fetch(`${API}/moods`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMoods(data);
      } catch (e) {
        console.error("Error fetching moods:", e);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    }

    fetchMoods();
  }, [router]);

  const Loader3 = () => (
    <div className="min-h-screen flex justify-center items-center bg-[#ddbb9f]">
      <div className="loader3 mx-2"></div>
      <div className="loader3 mx-2"></div>
      <div className="loader3 mx-2"></div>
    </div>
  );

  // ✅ SAVE MOOD TO BACKEND
  const handleMood = async (mood) => {
    if (!selectedDate) return;

    const token = localStorage.getItem("token");
    const dateStr = selectedDate.toISOString().slice(0, 10);

    try {
      await fetch(`${API}/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: dateStr,
          mood,
        }),
      });

      // update UI instantly
      setMoods((prev) => ({
        ...prev,
        [dateStr]: mood,
      }));

      setShowModal(false);
    } catch (err) {
      console.error("Error saving mood:", err);
    }
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

      {/* Calendar */}
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

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-sm text-slate-500">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-center text-black">
              Daily Pulse
            </DialogTitle>
            <p className="text-center text-black text-sm">
              How was {selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}?
            </p>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 mt-6">
            <Button onClick={() => handleMood("good")} className="py-7 rounded-2xl bg-green-500/60 text-slate-500">😊 Vibrant & Good</Button>
            <Button onClick={() => handleMood("average")} className="py-7 rounded-2xl bg-yellow-500/60 text-slate-500">😐 Just Fine</Button>
            <Button onClick={() => handleMood("bad")} className="py-7 rounded-2xl bg-red-500/60 text-slate-500">☹️ A Bit Tough</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Back */}
      <motion.div>
        <Button onClick={() => router.push('/dashboard')} className="mt-12">
          ← Return to Dashboard
        </Button>
      </motion.div>

      <style jsx global>{`
        .mood-good { background: #4ade80 !important; }
        .mood-average { background: #fde047 !important; }
        .mood-bad { background: #f87171 !important; }
      `}</style>
    </div>
  );
}