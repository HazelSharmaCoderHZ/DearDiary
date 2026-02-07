'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

// Animation variants for the cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function ServiceCard({ title, desc, icon, size, colorClass }) {
  // 3D Tilt Effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${size} group h-64 rounded-[2.5rem] p-8 transition-all duration-500 bg-white/60 backdrop-blur-md border border-purple-100 shadow-xl shadow-purple-100/20 hover:shadow-2xl hover:shadow-purple-200/40`}
    >
      {/* Animated Gradient Background that appears on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2.5rem] ${colorClass}`} />

      <div style={{ transform: "translateZ(40px)" }} className="relative z-10 h-full flex flex-col justify-between">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-purple-50 group-hover:bg-white transition-colors duration-500 text-4xl shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">
            {title}
          </h4>
          <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* Subtle accent line at the bottom */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1.5 group-hover:w-1/2 transition-all duration-500 rounded-t-full ${colorClass}`} />
    </motion.div>
  );
}

const services = [
  {
    title: "Journaling",
    desc: "Write freely without judgment in a safe, encrypted space.",
    icon: "✍️",
    size: "md:col-span-2",
    color: "bg-indigo-400",
  },
  {
    title: "Edit / Delete",
    desc: "Your words, your rules.",
    icon: "✂️",
    size: "md:col-span-1",
    color: "bg-fuchsia-400",
  },
  {
    title: "Mood Calendar",
    desc: "Visualize your emotional journey through a spectrum of colors.",
    icon: "🗓️",
    size: "md:col-span-1",
    color: "bg-purple-400",
  },
  {
    title: "View Entries",
    desc: "A beautiful timeline of your life's most precious memories.",
    icon: "📖",
    size: "md:col-span-2",
    color: "bg-blue-400",
  },
];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};
export default function DearDiaryPremiumLanding() {
  const benefits = [
    { emoji: "✨", text: "Unload thoughts stuck in your head", color: "from-purple-400 to-indigo-500" },
    { emoji: "🧠", text: "Name emotions to reduce anxiety", color: "from-blue-400 to-purple-500" },
    { emoji: "🌱", text: "Reveal emotional patterns over time", color: "from-teal-400 to-emerald-500" },
    { emoji: "💭", text: "Private space for honest expression", color: "from-pink-400 to-purple-600" },
    { emoji: "📅", text: "Mood tracking for self-awareness", color: "from-indigo-400 to-cyan-500" },
    { emoji: "💜", text: "Priortize your mental wellbeing with privacy", color: "from-purple-500 to-pink-500" },
  ];
  return (
    <div className="relative bg-gradient-to-br from-white via-purple-50 to-fuchsia-50 text-slate-800 overflow-hidden">

      {/* Floating gradient orbs */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-300/30 rounded-full blur-[160px] animate-pulse"></div>
      <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] bg-fuchsia-300/30 rounded-full blur-[180px] animate-pulse"></div>

      {/* NAVBAR */}
<nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-purple-100">
  <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
    {/* Hidden on small screens, flex on medium+ */}
    <h1 className="hidden md:block text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
      Dear Diary
    </h1>

    <div className="flex items-center gap-8 text-sm font-medium w-full md:w-auto justify-center md:justify-end">
      <a href="#about" className="hover:text-purple-600 transition">About</a>
      <a href="#services" className="hover:text-purple-600 transition">Services</a>
      <a href="#contact" className="hover:text-purple-600 transition">Contact</a>
      
      {/* Hidden on small screens, flex on medium+ */}
      <Link
        href="/login"
        className="hidden md:flex px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg hover:scale-105 transition"
      >
        Login
      </Link>
    </div>
  </div>
</nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center pt-32 px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-5xl"
        >
          <h2 className="text-6xl sm:text-7xl font-extrabold leading-tight">
            Your thoughts deserve a  
            <span className="block bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              beautiful space
            </span>
          </h2>

          <p className="mt-8 text-xl text-slate-600">
            Dear Diary is a personal sanctuary to write, reflect,
            and visualize your emotional journey - safely and beautifully.
          </p>

          <div className="mt-12 flex justify-center gap-6">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold shadow-xl transition  hover:bg-purple-200 "
            >
              Start Journaling
            </Link>
            <a
              href="#about"
              className="px-8 py-4 rounded-full border border-purple-300 text-purple-700 hover:bg-purple-200 transition"
            >
              Explore
            </a>
          </div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-28 px-8 bg-slate-50 overflow-hidden">
      
      {/* Dynamic Purple Waves */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-[0] z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px] fill-purple-600/10">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-6"
          >
            About Dear Diary,
          </motion.h3>
          <div className="h-1.5 w-32 bg-purple-500 mx-auto rounded-full shadow-lg shadow-purple-200" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, rotate: 1 }}
              className="group relative p-8 bg-white/80 backdrop-blur-lg border border-purple-100 rounded-3xl shadow-xl shadow-purple-100/50 hover:shadow-purple-200 transition-all cursor-default"
            >
              {/* Floating Gradient Circle Background */}
              <div className={`absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl opacity-10 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500`} />
              
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {item.emoji}
              </div>
              
              <p className="text-xl font-bold text-slate-800 leading-tight">
                {item.text}
              </p>
              
              <div className="mt-4 h-1 w-0 bg-purple-500 group-hover:w-full transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Blobs for Energy */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-24 -right-24 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    </section>

      {/* SERVICES */}
      <section id="services" className="py-28 px-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h3 className="text-5xl md:text-6xl font-bold text-purple-500 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">Our Services</span>
            </h3>
          </div>
          <p className="text-slate-400 text-lg md:text-right max-w-sm">
            Everything you need to capture your thoughts and master your mindset.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
          {services.map((service, i) => (
            <ServiceCard key={i} {...service} />
          ))}
        </div>
      </motion.div>
    </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-32 px-8 bg-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-50 z-0" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto z-10"
      >
        <div className="bg-white/40 backdrop-blur-md border border-purple-100 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-purple-100/50 text-center">
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-purple-600 uppercase bg-purple-50 rounded-full"
          >
            Get in touch
          </motion.div>

          <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            We would love to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
              connect with you
            </span>
          </h3>

          <p className="text-lg text-slate-500 mb-12 max-w-md mx-auto">
            Feedback, collaborations, or just a hello-our digital door is always open.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Email Button */}
            <motion.a
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:sharmahazel310@gmail.com"
              className="group flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all"
            >
              <span className="text-xl">💌</span>
              DearDiary@gmail.com
            </motion.a>

            {/* LinkedIn Button */}
            <motion.a
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://www.linkedin.com/in/hazelsharma-it/"
              target="_blank"
              className="flex items-center gap-3 bg-white border-2 border-purple-100 text-purple-600 px-8 py-4 rounded-2xl font-bold hover:border-purple-300 transition-all"
            >
              <span className="text-xl">🔗</span>
              Founder-Hazel Sharma
            </motion.a>
          </div>

          {/* Social Proof / Tiny Footer */}
          <div className="mt-16 pt-8 border-t border-purple-50 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="font-bold text-slate-400">come</span>
            <span className="font-bold text-slate-400">join</span>
            <span className="font-bold text-slate-400">Dear Diary</span>
          </div>
        </div>

        {/* Floating "Ink" Particles */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 text-6xl hidden md:block"
        >
          ✨
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-10 -right-10 text-6xl hidden md:block"
        >
          💜
        </motion.div>
      </motion.div>
    </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Dear Diary - Designed & built with 💜
      </footer>
    </div>
  );
}
