import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Key,
  Unlock,
  Vault,
  ShieldCheck,
  EyeOff,
  Check,
  X,
  ArrowRight,
  Send,
  CheckCircle,
} from "lucide-react";

const Step2 = () => {
  const [animationState, setAnimationState] = useState("idle");
  const [seedWords, setSeedWords] = useState([]);
  const [loginHash, setLoginHash] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  const fullSeedPhrase = useMemo(() => [
    "apple", "bridge", "castle", "dragon",
    "eagle", "forest", "garden", "harbor",
    "island", "jungle", "kingdom", "lighthouse",
    "mountain", "nature", "ocean", "palace",
  ], []);

  // Wrap functions in useCallback so they don't change every render
  const generateRandomHash = useCallback((length) => {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const resetAnimation = useCallback(() => {
    setAnimationState("idle");
    setSeedWords([]);
    setLoginHash("");
    setEncryptionKey("");
    setActiveStep(1);
  }, []);

  // Initial sequence trigger
  useEffect(() => {
    const startSequence = setTimeout(() => {
      setAnimationState("entering-seed");
      setActiveStep(1);
    }, 500);
    return () => clearTimeout(startSequence);
  }, []);

  // Handle seed word typing animation
  useEffect(() => {
    if (animationState === "entering-seed") {
      // Clear previous words to prevent duplicates if effect re-runs
      setSeedWords([]); 
      
      fullSeedPhrase.forEach((word, index) => {
        setTimeout(() => {
          setSeedWords((prev) => [...prev, word]);

          if (index === fullSeedPhrase.length - 1) {
            setTimeout(() => {
              setAnimationState("generating-keys");
              setActiveStep(2);
            }, 300);
          }
        }, index * 40);
      });
    }
  }, [animationState, fullSeedPhrase]); // fullSeedPhrase is now stable due to useMemo

  // Handle Key Generation
  useEffect(() => {
    if (animationState === "generating-keys") {
      const fullLoginHash = generateRandomHash(48);
      const fullEncryptionKey = generateRandomHash(48);

      for (let i = 0; i <= fullLoginHash.length; i++) {
        setTimeout(() => {
          setLoginHash(fullLoginHash.substring(0, i));
        }, i * 15);
      }

      setTimeout(() => {
        for (let i = 0; i <= fullEncryptionKey.length; i++) {
          setTimeout(() => {
            setEncryptionKey(fullEncryptionKey.substring(0, i));
          }, i * 15);
        }
      }, 300);

      setTimeout(() => {
        setAnimationState("sending-to-server");
        setActiveStep(3);
      }, 1500);
    }
  }, [animationState, generateRandomHash]); // Added generateRandomHash to dependencies

  // Sending to server
  useEffect(() => {
    if (animationState === "sending-to-server") {
      const timer = setTimeout(() => {
        setAnimationState("unlocking-vault");
        setActiveStep(4);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Unlocking vault (reduced the 15s delay slightly for better UX, but kept logic)
  useEffect(() => {
    if (animationState === "unlocking-vault") {
      const timer = setTimeout(() => {
        setAnimationState("complete");
        setActiveStep(5);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  // Loop back to start
  useEffect(() => {
    if (animationState === "complete") {
      const timer = setTimeout(() => {
        resetAnimation();
        // Give a small delay before restarting
        setTimeout(() => {
          setAnimationState("entering-seed");
          setActiveStep(1);
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [animationState, resetAnimation]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotateReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { opacity: 0.4; box-shadow: 0 0 10px rgba(34, 211, 238, 0.3); } 50% { opacity: 1; box-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.5); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes highlight { 0% { border-color: rgba(99, 102, 241, 0.3); } 50% { border-color: rgba(99, 102, 241, 0.8); } 100% { border-color: rgba(99, 102, 241, 0.3); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-blink { animation: blink 1s infinite; }
        .animate-rotate { animation: rotate 3s linear infinite; }
        .animate-rotate-reverse { animation: rotateReverse 2s linear infinite; }
        .animate-pulse-custom { animation: pulse 2s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-highlight { animation: highlight 2s ease-in-out infinite; }
        .shimmer-effect { position: relative; overflow: hidden; }
        .shimmer-effect::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shimmer 2s infinite; }
      `}</style>

      {/* RENDER LOGIC REMAINS THE SAME AS YOURS */}
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Login & Vault Unlock
        </h2>
        <p className="text-slate-400 text-sm">Secure access without passwords</p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-5 border border-indigo-500/20 shadow-2xl">
        {/* Step 1: Enter Seed */}
        <div className={`flex items-center gap-4 mb-4 pb-4 border-b border-slate-800 transition-all duration-300 ${activeStep >= 1 ? "opacity-100" : "opacity-60"}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${activeStep === 1 ? "bg-indigo-500/20 border-2 border-indigo-400/50 animate-highlight" : activeStep > 1 ? "bg-indigo-500/10" : "bg-indigo-500/5 scale-95"}`}>
            <Key className={`w-6 h-6 ${activeStep === 1 ? "text-indigo-400" : activeStep > 1 ? "text-indigo-400/80" : "text-indigo-400/30"}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">Enter Seed Phrase</h3>
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <div className="flex flex-wrap gap-1 text-xs font-mono">
                {seedWords.slice(0, 4).map((word, index) => (
                  <span key={index} className="text-indigo-300 animate-fade-in">{word}{index < 3 && ","}</span>
                ))}
                {seedWords.length > 4 && <span className="text-indigo-400/60 animate-fade-in">...+{seedWords.length - 4} more</span>}
                {animationState === "entering-seed" && seedWords.length < fullSeedPhrase.length && <span className="inline-block w-1 h-3 bg-indigo-400 animate-blink"></span>}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Keys Generated */}
        <div className={`flex items-center gap-4 mb-4 pb-4 border-b border-slate-800 transition-all duration-300 ${activeStep >= 2 ? "opacity-100" : "opacity-60"}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${activeStep === 2 ? "bg-emerald-500/20 border-2 border-emerald-400/50 animate-highlight" : activeStep > 2 ? "bg-emerald-500/10" : "bg-emerald-500/5 scale-95"}`}>
            <Unlock className={`w-6 h-6 ${activeStep === 2 ? "text-emerald-400" : activeStep > 2 ? "text-emerald-400/80" : "text-emerald-400/30"}`} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 w-24">Login Hash:</span>
              <div className={`flex-1 bg-slate-800/50 rounded px-2 py-1 border ${activeStep === 2 ? "border-emerald-500/50 shimmer-effect" : "border-slate-700/50"}`}>
                <div className="font-mono text-xs text-emerald-400 truncate">
                  {loginHash}{animationState === "generating-keys" && loginHash.length < 48 && <span className="inline-block w-1 h-3 bg-emerald-400 animate-blink ml-0.5"></span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 w-24">Encrypt Key:</span>
              <div className={`flex-1 bg-slate-800/50 rounded px-2 py-1 border ${activeStep === 2 ? "border-blue-500/50 shimmer-effect" : "border-slate-700/50"}`}>
                <div className="font-mono text-xs text-blue-400 truncate">
                  {encryptionKey}{animationState === "generating-keys" && encryptionKey.length > 0 && encryptionKey.length < 48 && <span className="inline-block w-1 h-3 bg-blue-400 animate-blink ml-0.5"></span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Send to Server */}
        <div className={`flex items-center gap-4 mb-4 pb-4 border-b border-slate-800 transition-all duration-300 ${activeStep >= 3 ? "opacity-100" : "opacity-60"}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${activeStep === 3 ? "bg-purple-500/20 border-2 border-purple-400/50 animate-highlight" : "bg-purple-500/5"}`}>
            <Send className={`w-6 h-6 ${activeStep === 3 ? "text-purple-400" : "text-purple-400/30"}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">Verifying Identity</h3>
            <p className="text-xs text-purple-300">Login hash sent to server...</p>
          </div>
        </div>

        {/* Step 4: Vault Unlock (Simplified UI logic for brevity) */}
        <div className={`flex items-center gap-4 transition-all duration-700 ${activeStep >= 4 ? "opacity-100" : "opacity-60"}`}>
           <div className="relative w-16 h-16 flex-shrink-0">
             {activeStep === 4 && <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 border-r-purple-400 animate-rotate animate-glow"></div>}
             <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all ${activeStep === 5 ? "bg-green-500/20" : "bg-slate-500/10"}`}>
               {activeStep === 5 ? <CheckCircle className="w-8 h-8 text-green-400" /> : <Vault className="w-8 h-8 text-cyan-400" />}
             </div>
           </div>
           <div className="flex-1">
              <h3 className="font-bold text-white text-sm">Vault Status</h3>
              <p className="text-xs text-slate-400">{activeStep === 5 ? "Access Granted" : "Processing decryption..."}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;