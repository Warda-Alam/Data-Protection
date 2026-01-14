import React, { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';

const IdentityHashBlock = ({ isActive }) => {
  const [displayHash, setDisplayHash] = useState("000000000000...00000");
  const [isComputing, setIsComputing] = useState(false);
  
  const finalHash = "7f83b1657ff12e9a82b410d9069";
  const characters = "abcdef0123456789";

  useEffect(() => {
    let interval;
    
    if (isActive) {
      setIsComputing(true);
      let iterations = 0;
      const maxIterations = 20; // Number of "scrambles"

      interval = setInterval(() => {
        // Generate a random string of similar length
        const randomString = Array.from({ length: 24 })
          .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
          .join("");
        
        setDisplayHash(randomString + "...");
        
        iterations++;
        if (iterations >= maxIterations) {
          clearInterval(interval);
          setDisplayHash(finalHash);
          setIsComputing(false);
        }
      }, 50); // Speed of scrambling
    } else {
      // Reset when not active
      setDisplayHash("7f83b1657ff1...d9069");
      setIsComputing(false);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`transition-all duration-500 rounded-xl p-6 border ${
      isActive 
        ? "scale-[1.02] border-blue-500/50 bg-slate-800/80 shadow-[0_0_20px_rgba(59,130,246,0.15)] opacity-100" 
        : "opacity-40 grayscale-[0.5] border-slate-800"
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-700'
        }`}>
          <Hash className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
        </div>
        <h3 className="font-semibold text-white">2. Identity Hash</h3>
      </div>

      <div className={`relative bg-slate-950 rounded-lg p-3 font-mono text-xs break-all border transition-all duration-300 ${
        isComputing ? "border-blue-500/50 text-blue-300 blur-[0.5px]" : "border-blue-500/20 text-blue-400 blur-0"
      }`}>
        {displayHash}
        {isComputing && (
          <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-lg" />
        )}
      </div>
      
      {isActive && (
        <div className="mt-2 text-[10px] text-blue-500/70 font-bold uppercase tracking-widest text-right animate-pulse">
          {isComputing ? "Computing SHA-256..." : "Hash Verified"}
        </div>
      )}
    </div>
  );
};

export default IdentityHashBlock;