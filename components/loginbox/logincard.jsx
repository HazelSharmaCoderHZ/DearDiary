"use client";
import Link from 'next/link';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseconfig"; // adjust if needed

export default function Logincard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
   <form onSubmit={handleLogin} className="p-4 bg-white shadow rounded">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="block w-full mb-2 border p-2"
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="block w-full mb-2 border p-2"
      required
    />
    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
      Open My Diary
    </button>

    <p className="mt-4 text-sm text-center">
      New user?{" "}
      <Link href="/signup" className="text-blue-600 underline hover:text-blue-800">
        Sign Up
      </Link>
    </p>
   </form>
  );

}
