"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "../../firebase/firebaseconfig";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // New state for button loading

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 1. Handle Email/Password Signup + Verification
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send Verification Email immediately
      await sendEmailVerification(userCredential.user);
      
      alert("Verification email sent! Please check your inbox before logging in.");
      router.push("/login"); // Redirect to login so they can verify first
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Handle Google Authentication
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Google accounts are pre-verified, so we go straight to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-purple-100">
      {/* LEFT SIDE: IMAGE */}
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
        <img
          src="/img4.png"
          alt="Journaling"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-none" />
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        {/* Decorative Background Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] bg-purple-100  -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md shadow-2xl shadow-purple-100 border rounded-[2.5rem] p-8 md:p-10 bg-white border-purple-50"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-800 mb-3">Create Account</h1>
            <p className="text-slate-500 font-medium">Start your mindful journey today.</p>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all mb-6 group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-slate-100" />
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">or email</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 transition shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-slate-800 transition shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transition-all duration-300 mt-4 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isProcessing ? "Creating Sanctuary..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 font-bold hover:underline">Log In</a>
            </p>
            <a href="/" className="block text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-purple-600 transition-colors">
              ← Go back home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}