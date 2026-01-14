import React, { useState, useEffect, useRef } from "react";
import { Key } from "lucide-react";

const EncryptionKeyBlock = ({ isActive }) => {
  const [key, setKey] = useState("Waiting for input...");
  const [status, setStatus] = useState("Pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);

  const genHex = (len) =>
    ([...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""));

  useEffect(() => {
    isMounted.current = true;

    const startAnimation = async () => {
      if (!isActive) {
        // Reset state when not active
        setKey("Waiting for input...");
        setStatus("Pending");
        setProgress(0);
        setIsProcessing(false);
        return;
      }

      // Start Sequence
      setIsProcessing(true);
      setKey("Initializing...");
      setStatus("Pending");
      setProgress(10);

      await new Promise((r) => setTimeout(r, 600));
      if (!isMounted.current) return;
      setStatus("Gathering Entropy...");
      setProgress(40);

      // Jitter hex effect
      const interval = setInterval(() => {
        setKey(genHex(32));
      }, 80);

      await new Promise((r) => setTimeout(r, 1200));
      clearInterval(interval);
      if (!isMounted.current) return;

      setStatus("Generating...");
      setProgress(100);
      const finalKey = "0x" + genHex(40).toUpperCase();

      // Typewriter final key
      for (let i = 0; i <= finalKey.length; i++) {
        if (!isMounted.current) return;
        setKey(finalKey.substring(0, i));
        await new Promise((r) => setTimeout(r, 15));
      }

      setStatus("Verified");
      setIsProcessing(false);
    };

    startAnimation();

    return () => {
      isMounted.current = false;
    };
  }, [isActive]); // Triggers every time isActive changes

  return (
    <div className={`bg-slate-900/50 border rounded-xl p-6 relative overflow-hidden transition-all duration-500 ${
      isActive ? "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]" : "border-slate-800 opacity-50"
    }`}>
      {/* Progress Bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
          <Key className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
        </div>
        <h3 className={`text-sm font-bold ${isActive ? 'text-cyan-100' : 'text-slate-500'}`}>Encryption Key</h3>
      </div>

      <div className="bg-black/40 rounded-lg p-4 font-mono text-xs border border-slate-800/50 min-h-[70px] flex items-center">
        <span className={`break-all ${isProcessing ? "text-cyan-400/50" : "text-cyan-400"}`}>
          {key}
          {isProcessing && <span className="animate-pulse ml-1 text-cyan-400">|</span>}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px]">
        <span className="text-slate-600 tracking-widest font-bold">AES-256-GCM</span>
        <span className={`font-bold tracking-widest uppercase transition-colors duration-500 ${
          status === "Verified" ? "text-emerald-500" : isActive ? "text-cyan-500 animate-pulse" : "text-slate-700"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default EncryptionKeyBlock;