'use client';

import { useState, useEffect } from "react";
import { signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, provider } from "../../firebase/firebaseconfig";
import { useRouter } from "next/navigation"; 
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if already logged in AND verified
  useEffect(() => {
    if (user && user.emailVerified) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      await signInWithPopup(auth, provider);
      // Google users are generally verified by default
      router.push("/dashboard");
    } catch (error) {
      setErrorMsg("Google login failed. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🛑 THE SECURITY CHECK: Is the email verified?
      if (!user.emailVerified) {
        setErrorMsg("Please verify your email address before signing in. Check your inbox!");
        await signOut(auth); // Force sign out so the AuthContext doesn't redirect them
        return;
      }

      // If verified, proceed to dashboard
      router.push("/dashboard");
    } catch (error) {
      setErrorMsg("Invalid credentials. Please check your email and password.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-purple-100">
      
      {/* LEFT SIDE: PURE IMAGE */}
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
        <img
          src="/imgg3.png" 
          alt="Reflecting"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
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

          {/* Error Message Display */}
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

          {/* Google Sign In Option */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all duration-300 shadow-sm group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Continue with Google
          </button>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-slate-100"></div>
            <span className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Or secure entry</span>
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 transition shadow-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 transition shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-purple-600 active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
            >
              {isProcessing ? "Authenticating..." : "Sign In to Vault"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-600 font-medium">
              New here?{" "}
              <a href="/signup" className="text-purple-600 font-bold hover:underline underline-offset-4">
                Join the sanctuary
              </a>
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-[10px] font-black text-slate-300 hover:text-purple-500 transition-colors uppercase tracking-[0.3em]"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}