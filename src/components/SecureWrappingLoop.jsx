import React, { useState, useEffect } from 'react';
import { LockKeyhole, Lock, Vault, ShieldCheck } from 'lucide-react';

const SecureWrappingLoop = ({ isActive }) => {
  const [isMerged, setIsMerged] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Control animation based on isActive prop
  useEffect(() => {
    if (isActive) {
      // Start animation when component becomes active
      setShouldAnimate(true);
      
      // Start the merge/unmerge loop
      const interval = setInterval(() => {
        setIsMerged(prev => !prev);
      }, 4000);

      return () => {
        clearInterval(interval);
        setShouldAnimate(false);
      };
    } else {
      // Reset state when inactive
      setShouldAnimate(false);
      setIsMerged(false);
    }
  }, [isActive]);

  // Reset animation when isActive changes
  useEffect(() => {
    if (isActive) {
      // Start with unmerged state for the first animation
      setIsMerged(false);
      
      // Trigger first merge after a short delay
      const timer = setTimeout(() => {
        setIsMerged(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className={`bg-slate-900/50 rounded-xl p-6 border transition-all duration-300 ${
      isActive ? 'border-pink-500/30 shadow-lg' : 'border-slate-700/50'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center relative transition-all duration-300 ${
          isActive 
            ? 'bg-pink-500/20 border border-pink-500/30' 
            : 'bg-slate-800/50 border border-slate-700'
        }`}>
          <ShieldCheck className={`w-6 h-6 transition-all duration-300 ${
            isActive ? 'text-pink-400' : 'text-slate-500'
          }`} />
          {isActive && shouldAnimate && (
            <div className="absolute inset-0 rounded-lg border border-pink-500 animate-ping opacity-20"></div>
          )}
        </div>
        <div>
          <h3 className={`font-semibold transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-slate-400'
          }`}>
            5. Secure Wrapping
          </h3>
          <p className={`text-xs transition-colors duration-300 ${
            isActive ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Private key encrypted for server storage
          </p>
        </div>
      </div>

      {/* Animation Canvas */}
      <div className="rounded-xl relative min-h-[120px] flex items-center">
        <div className="flex items-center justify-around w-full relative">
          
          {/* 1. The Private Key (Red) */}
          <div className={`flex flex-col items-center transition-all duration-[1500ms] ease-in-out ${
            isActive && shouldAnimate && isMerged 
              ? 'translate-x-12 opacity-0' 
              : 'translate-x-0 opacity-100'
          }`}>
            <div className={`p-2 rounded-md border transition-all duration-300 ${
              isActive 
                ? 'bg-red-500/10 border-red-500/20' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <LockKeyhole className={`w-6 h-6 transition-colors duration-300 ${
                isActive ? 'text-red-400' : 'text-slate-500'
              }`} />
            </div>
            <span className={`text-[8px] uppercase mt-1 font-bold transition-colors duration-300 ${
              isActive ? 'text-red-400' : 'text-slate-500'
            }`}>
              Private Key
            </span>
          </div>

          {/* 2. The Encryption Key (Emerald) */}
          <div className={`flex flex-col items-center transition-all duration-[1500ms] ease-in-out ${
            isActive && shouldAnimate && isMerged 
              ? '-translate-x-12 opacity-0' 
              : 'translate-x-0 opacity-100'
          }`}>
            <div className={`p-2 rounded-md border transition-all duration-300 ${
              isActive 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <Lock className={`w-6 h-6 transition-colors duration-300 ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`} />
            </div>
            <span className={`text-[8px] uppercase mt-1 font-bold transition-colors duration-300 ${
              isActive ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              Enc. Key
            </span>
          </div>

          {/* 3. THE RESULT (Pink Vault) */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1000ms] ${
            isActive && shouldAnimate && isMerged 
              ? 'opacity-100 scale-110 delay-500' 
              : 'opacity-0 scale-50 delay-0'
          }`}>
            <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              isActive 
                ? 'bg-pink-500/20 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <Vault className={`w-10 h-10 transition-colors duration-300 ${
                isActive ? 'text-pink-400' : 'text-slate-500'
              }`} />
            </div>
            <div className="text-center mt-2">
              <span className={`text-[10px] uppercase font-bold tracking-widest block transition-colors duration-300 ${
                isActive ? 'text-pink-300' : 'text-slate-400'
              }`}>
                Encrypted Blob
              </span>
              <span className={`text-[7px] uppercase transition-colors duration-300 ${
                isActive ? 'text-pink-400/60' : 'text-slate-500'
              }`}>
                Ready for Sync
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive && shouldAnimate 
            ? isMerged ? 'bg-pink-500' : 'bg-blue-500' 
            : 'bg-slate-600'
        }`}></div>
        <p className={`text-[10px] transition-colors duration-300 italic ${
          isActive ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {isActive 
            ? shouldAnimate 
              ? isMerged 
                ? 'Encryption complete ✓' 
                : 'Encrypting private key...' 
              : 'Ready to encrypt'
            : 'Secure key wrapping'}
        </p>
      </div>
    </div>
  );
};

export default SecureWrappingLoop;