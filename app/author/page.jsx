import React from "react";

const ProfileIntro = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      
      <div className="relative w-[220px] h-[220px] mb-6">
      
        <div className="absolute inset-0 rounded-full animate-spin bg-gradient-to-tr from-purple-500 to-cyan-400 blur-md shadow-2xl" />

       
        <div className="absolute inset-0 rounded-full bg-neutral-900 blur-xl" />

    
        <img
          src="/hazel.jpg"
          alt="Hazel"
          className="absolute top-1/2 left-1/2 w-[160px] h-[160px] rounded-full border-8 border-white object-cover transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Introduction Text */}
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4">Hi, I'm <span className="text-blue-300">Hazel Sharma 👋</span></h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          IT Student | Aspiring technologist | Lifelong Learner<br /><br></br>
          Sophomore at VIT Vellore, exploring my place in tech. Passionate about building, learning, and contributing to innovative teams that make a difference.
        </p>
      </div>
    </div>
  );
};

export default ProfileIntro;
