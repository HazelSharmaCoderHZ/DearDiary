'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // ✅ FIX: removed invalid `currentUser` reference, use token directly
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const parsed = user ? JSON.parse(user) : {};
      setUserEmail(parsed.email || "");
    } catch (e) {
      // malformed user JSON — still let them in, token is valid
    }

    setLoading(false); // ✅ only called when token exists
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-purple-600 font-medium animate-pulse">Opening your sanctuary...</p>
      </div>
    </div>
  );

  const menuItems = [
    { title: "Pen Today's Thought", icon: "✍️", link: "/write", color: "from-purple-500 to-indigo-500" },
    { title: "Your MoodMap", icon: "🌈", link: "/moodmap", color: "from-fuchsia-500 to-purple-600" },
    { title: "Revisit Old Pages", icon: "📖", link: "/viewnotes", color: "from-blue-500 to-purple-500" },
    { title: "Edit / Delete Past", icon: "📝", link: "/editnotes", color: "from-purple-400 to-pink-500" },
  ];

  return (
    <div className="relative min-h-screen w-full fourthpageanim overflow-hidden font-sans text-slate-900">

      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-100/50 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ddbb9f] blur-[100px]" />

      <nav className="relative z-15 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* ✅ show email if available */}
        {userEmail && (
          <p className="text-xs text-slate-400 font-medium">{userEmail}</p>
        )}
        <button
          onClick={handleLogout}
          className="text-xs font-bold uppercase bg-[#1e1616] hover:bg-purple-100 tracking-widest text-slate-200 hover:text-purple-600 border m-1 p-2 rounded transition-colors ml-auto"
        >
          Logout
        </button>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-row gap-6 items-center justify-center">
            <h2 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1e1616] via-fuchsia-800 to-[#1e1616] tracking-tight leading-tight">
              Hello, Mindful Soul
            </h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-purple-100 flex items-center justify-center text-4xl border border-purple-50"
            >
              💜
            </motion.div>
          </div>
          <p className="mt-6 text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
            Your private space to breathe, reflect, and grow. What's on your mind today?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index} className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden p-8 rounded-[2rem] bg-white border border-purple-100 shadow-xl shadow-purple-100/20 flex flex-col items-start text-left transition-all group-hover:shadow-2xl group-hover:shadow-purple-200/50"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-full -mr-10 -mt-10 transition-opacity duration-500`} />
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[#3d1d09] transition-colors">
                  {item.title}
                </h3>
                <div className="h-1 w-0 bg-[#967e7e] group-hover:w-full transition-all duration-500 rounded-full mt-2" />
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 p-6 bg-white/50 backdrop-blur-sm border border-white rounded-3xl"
        >
          <p className="text-sm italic text-slate-400 tracking-wide">
            "Journaling isn't just writing — it's therapy on paper."
          </p>
        </motion.div>
      </div>
    </div>
  );
}