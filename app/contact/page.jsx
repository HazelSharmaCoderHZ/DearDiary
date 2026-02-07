'use client';

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="relative fifthpageanim h-screen w-screen overflow-hidden text-white">
      <div className="absolute top-0 left-0 w-full h-full "></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full backdrop-blur-md bg-opacity-40 p-10" >
        <h1 className="text-6xl font-bold mb-6">Contact Us</h1>
        <p className="max-w-2xl text-center text-lg">
          We'd love to hear from you! Reach out at 
          <a 
           href="mailto:sharmahazel310@gmail.com" 
           className="underline text-cyan-300 mx-1"
          >
           Hazel@deardiary.app
          </a> 
          or connect via our LinkedIn 
          <a 
           href="https://www.linkedin.com/in/hazelsharma-it" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="underline text-cyan-300 mx-1"
          >
          Founder@DearDiary
          </a>.
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
