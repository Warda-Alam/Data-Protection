import React, { useState, useEffect } from 'react';
import { LockKeyhole, Lock, Vault, ShieldCheck } from 'lucide-react';

const SecureWrappingLoop = () => {
  const [isMerged, setIsMerged] = useState(false);

  useEffect(() => {
    // Create an infinite loop: merge for 3 seconds, reset for 2 seconds
    const interval = setInterval(() => {
      setIsMerged(prev => !prev);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-pink-500/30 shadow-lg transition-all duration-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center relative">
          <ShieldCheck className="w-6 h-6 text-pink-400" />
          <div className="absolute inset-0 rounded-lg border border-pink-500 animate-ping opacity-20"></div>
        </div>
        <div>
          <h3 className="font-semibold text-white">5. Secure Wrapping</h3>
          <p className="text-xs text-slate-400">Private key encrypted for server storage</p>
        </div>
      </div>

      {/* Animation Canvas */}
      <div className=" rounded-xl  relative  min-h-[120px] flex items-center">
        <div className="flex items-center justify-around w-full relative">
          
          {/* 1. The Private Key (Red) - Moves Right */}
          <div className={`flex flex-col items-center transition-all duration-[1500ms] ease-in-out ${
            isMerged ? 'translate-x-12 opacity-0' : 'translate-x-0 opacity-100'
          }`}>
            <div className="p-2 bg-red-500/10 rounded-md border border-red-500/20">
              <LockKeyhole className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-[8px] text-red-400 uppercase mt-1 font-bold">Private Key</span>
          </div>

          {/* 2. The Encryption Key (Emerald) - Moves Left */}
          <div className={`flex flex-col items-center transition-all duration-[1500ms] ease-in-out ${
            isMerged ? '-translate-x-12 opacity-0' : 'translate-x-0 opacity-100'
          }`}>
            <div className="p-2 bg-emerald-500/10 rounded-md border border-emerald-500/20">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[8px] text-emerald-400 uppercase mt-1 font-bold">Enc. Key</span>
          </div>

          {/* 3. THE RESULT (Pink Vault) - Scales Up when keys merge */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1000ms] delay-500 ${
            isMerged ? 'opacity-100 scale-110' : 'opacity-0 scale-50'
          }`}>
            <div className="bg-pink-500/20 p-4 rounded-xl border-2 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              <Vault className="w-10 h-10 text-pink-400" />
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-pink-300 font-bold uppercase tracking-widest block">
                Encrypted Blob
              </span>
              <span className="text-[7px] text-pink-400/60 uppercase">Ready for Sync</span>
            </div>
          </div>

        </div>
      </div>

      <p className="text-[10px] text-slate-500 mt-4 text-center italic">
        This process ensures the server never sees your raw private key.
      </p>
    </div>
  );
};

export default SecureWrappingLoop;