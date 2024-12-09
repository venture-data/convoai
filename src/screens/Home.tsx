import React from "react";
import whisperAi from "../assets/whisper_ai.png";
import X from "../assets/X.png";
import venture_data from "../assets/venture_data.png";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#081B33] text-white px-4 md:px-16">
      {/* Animated Images */}
      <div className="flex justify-center items-center gap-4 md:gap-8 mb-4 md:mb-8">
        <img
          src={whisperAi}
          alt="Whisper AI logo"
          className="h-28 w-28 md:h-40 md:w-40 object-contain animate-fade-in"
        />
        <img
          src={X}
          alt="X logo"
          className="h-10 w-10 md:h-16 md:w-16 object-contain animate-fade-in-delay"
        />
        <img
          src={venture_data}
          alt="Venture Data logo"
          className="h-28 w-28 md:h-44 md:w-44 object-contain animate-fade-in-longer"
        />
      </div>

      {/* Animated Text */}
      <p className="text-lg md:text-2xl font-semibold mb-4 md:mb-6 min-h-[3rem] text-center">
        <TypeAnimation
          sequence={["Are you ready to step into the world of AI?", 3000]}
          speed={25}
          style={{ fontSize: "1em" }}
          repeat={Infinity}
        />
      </p>

      {/* Call-to-Action Button */}
      <Link to="/aidial">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-full text-sm md:text-lg hover:shadow-lg hover:scale-105 transition-all active:scale-95">
          Let's GO!
        </button>
      </Link>

      {/* Footer */}
      <div className="text-center fixed bottom-3">
        <p className="text-gray-400 text-sm">Powered by Venture Data AI</p>
      </div>

      {/* Animations */}
      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-in-out 0.3s;
        }
        .animate-fade-in-longer {
          animation: fade-in 1s ease-in-out 0.6s;
        }
      `}</style>
    </div>
  );
}

export default Home;
