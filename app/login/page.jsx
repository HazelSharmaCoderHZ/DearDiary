'use client';

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.replace("/dashboard");
  }
}, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      // ✅ FIXED: store BOTH token + user
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);

        // 🔥 IMPORTANT (for dashboard)
        localStorage.setItem("user", JSON.stringify({
          email: data.user?.email || email
        }));

        router.push("/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }

    } catch (error) {
      setErrorMsg("Server error. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#ddbb9f]">
      
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
        <img src="/imgg3.png" alt="Reflecting" className="absolute inset-0 w-full h-full object-cover"/>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 blur-[100px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-purple-50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-purple-100/20"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Continue your digital journey.</p>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border rounded-2xl"
              required
            />

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 text-black border rounded-2xl"
              required
            />

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl"
            >
              {isProcessing ? "Authenticating..." : "Sign In to Vault"}
            </button>
          </form>

          <p className="mt-4 text-sm text-black text-center">
            New here? <a href="/signup" className="text-purple-600">Join</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}