'use client';

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="relative fifthpageanim h-screen w-screen overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-full h-full z-0" ></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full backdrop-blur-md bg-opacity-40 p-10">
        <h1 className="text-6xl font-bold mb-6"><span className="text-white">About </span><span className="text-cyan-400">Dear Diary</span> </h1>
        <div className="w-1/2 h-1 bg-cyan-400 my-4 mx-auto"></div>
        <p className="max-w-2xl text-center text-lg">
          <br></br>Dear Diary is more than just a journaling app — it’s your personal space to reflect, express, and feel safe. Built with care and emotions, it helps you track your feelings day by day with a warm, calming design.
        </p>
        <Link href="/" className="mt-10 text-cyan-300 hover:underline">
          ⬅ Back to Login
        </Link>
        <Link href="/author" className="mt-2 text-cyan-300 hover:underline">
          ⬅ About The Author
        </Link>
      </div>
    </div>
  );
}
