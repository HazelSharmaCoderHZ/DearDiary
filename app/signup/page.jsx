"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        router.push("/login");
      } else {
        alert(data.message || "Signup failed");
      }

    } catch (error) {
      alert("Server error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex text-black flex-col md:flex-row bg-[#ddbb9f]">

      <div className="relative hidden md:flex md:w-1/2">
        <img src="/img4.png" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex items-center justify-center p-10">
        <motion.div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          
          <h1 className="text-3xl text-black font-bold mb-6">Create Account</h1>

          <form onSubmit={handleSignup} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border rounded-xl"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-xl"
              required
            />

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-purple-600 text-white py-4 rounded-xl"
            >
              {isProcessing ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="mt-4 text-sm">
            Already have an account? <a href="/login" className="text-purple-600">Login</a>
          </p>

        </motion.div>
      </div>
    </div>
  );
}