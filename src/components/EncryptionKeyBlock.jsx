import React, { useState, useEffect, useRef } from "react";
import { Key, ShieldCheck } from "lucide-react";

const EncryptionKeyBlock = () => {
  const [key, setKey] = useState("Waiting for input...");
  const [status, setStatus] = useState("Pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use a ref to track if the component is still mounted
  const isMounted = useRef(true);

  const genHex = (len) =>
    [...Array(len)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

  const runSequence = async () => {
    if (!isMounted.current) return;

    // 1. Reset
    setIsProcessing(true);
    setKey("Initializing...");
    setStatus("Pending");
    setProgress(0);

    // 2. Simulate "Gathering Entropy" phase
    await new Promise((r) => setTimeout(r, 1000));
    if (!isMounted.current) return;
    setStatus("Gathering Entropy...");
    setProgress(30);

    // 3. Simulate "Calculation" phase (jittering hex)
    const interval = setInterval(() => {
      setKey(genHex(32));
    }, 80);

    await new Promise((r) => setTimeout(r, 2000));
    clearInterval(interval);
    if (!isMounted.current) return;

    // 4. Finalizing & Typewriter Effect
    setStatus("Generating...");
    setProgress(100);
    const finalKey = "0x" + genHex(48).toUpperCase();

    for (let i = 0; i <= finalKey.length; i++) {
      if (!isMounted.current) return;
      setKey(finalKey.substring(0, i));
      await new Promise((r) => setTimeout(r, 20));
    }

    setStatus("Verified");
    setIsProcessing(false);

    // 5. PAUSE then RESTART the sequence
    await new Promise((r) => setTimeout(r, 3000)); // Wait 3 seconds at the finished state
    runSequence(); // Call itself to loop
  };

  useEffect(() => {
    isMounted.current = true;
    runSequence();

    return () => {
      isMounted.current = false; // Stop the loop when user leaves the page
    };
  }, []);

  return (
    <>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden group shadow-2xl">
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Key className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-bold text-cyan-100">Encryption Key</h3>
        </div>

        <div className="bg-black/40 rounded-lg p-4 font-mono text-sm border border-slate-800/50 min-h-[80px] flex items-center">
          <span className={`break-all ${isProcessing ? "text-cyan-400/50" : "text-cyan-400"}`}>
            {key}
            {isProcessing && <span className="animate-pulse ml-1 text-cyan-400">|</span>}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center text-xs">
          <span className="text-slate-500">AES-256-GCM</span>
          <span className={`font-bold tracking-widest uppercase transition-colors duration-500 ${
              status === "Verified" ? "text-emerald-500" : "text-cyan-500 animate-pulse"
            }`}>
            {status}
          </span>
        </div>
      </div>

    </>
  );
};

export default EncryptionKeyBlock;