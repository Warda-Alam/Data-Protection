import React, { useState, useEffect } from "react";
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
  const [activeStep, setActiveStep] = useState(1); // Track which step is active

  const fullSeedPhrase = [
    "apple",
    "bridge",
    "castle",
    "dragon",
    "eagle",
    "forest",
    "garden",
    "harbor",
    "island",
    "jungle",
    "kingdom",
    "lighthouse",
    "mountain",
    "nature",
    "ocean",
    "palace",
  ];

  const generateRandomHash = (length) => {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const resetAnimation = () => {
    setAnimationState("idle");
    setSeedWords([]);
    setLoginHash("");
    setEncryptionKey("");
    setActiveStep(1);
  };

  useEffect(() => {
    const startSequence = setTimeout(() => {
      setAnimationState("entering-seed");
      setActiveStep(1);
    }, 500);

    return () => clearTimeout(startSequence);
  }, []);

  useEffect(() => {
    if (animationState === "entering-seed") {
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
  }, [animationState]);

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
  }, [animationState]);

  useEffect(() => {
    if (animationState === "sending-to-server") {
      setTimeout(() => {
        setAnimationState("unlocking-vault");
        setActiveStep(4);
      }, 2000);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === "unlocking-vault") {
      setTimeout(() => {
        setAnimationState("complete");
        setActiveStep(5);
      }, 15000);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === "complete") {
      setTimeout(() => {
        resetAnimation();
        setTimeout(() => {
          setAnimationState("entering-seed");
          setActiveStep(1);
        }, 500);
      }, 3000);
    }
  }, [animationState]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { 
            opacity: 0.4;
            box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
          }
          50% { 
            opacity: 1;
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.5);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes highlight {
          0% { border-color: rgba(99, 102, 241, 0.3); }
          50% { border-color: rgba(99, 102, 241, 0.8); }
          100% { border-color: rgba(99, 102, 241, 0.3); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-rotate {
          animation: rotate 3s linear infinite;
        }
        
        .animate-rotate-reverse {
          animation: rotateReverse 2s linear infinite;
        }
        
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-highlight {
          animation: highlight 2s ease-in-out infinite;
        }
        
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Login & Vault Unlock
        </h2>
        <p className="text-slate-400 text-sm">
          Secure access without passwords
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-5 border border-indigo-500/20 shadow-2xl">
        {/* Step 1: Enter Seed */}
        <div
          className={`flex items-center gap-4 mb-4 pb-4 border-b border-slate-800 transition-all duration-300 ${
            activeStep >= 1 ? "opacity-100" : "opacity-60"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              activeStep === 1
                ? "bg-indigo-500/20 scale-100 border-2 border-indigo-400/50 animate-highlight"
                : activeStep > 1
                ? "bg-indigo-500/10 scale-100"
                : "bg-indigo-500/5 scale-95"
            }`}
          >
            <Key
              className={`w-6 h-6 transition-all duration-300 ${
                activeStep === 1
                  ? "text-indigo-400"
                  : activeStep > 1
                  ? "text-indigo-400/80"
                  : "text-indigo-400/30"
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">
              Enter Seed Phrase
            </h3>
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <div className="flex flex-wrap gap-1 text-xs font-mono">
                {seedWords.slice(0, 4).map((word, index) => (
                  <span key={index} className="text-indigo-300 animate-fade-in">
                    {word}
                    {index < 3 && ","}
                  </span>
                ))}
                {seedWords.length > 4 && (
                  <span className="text-indigo-400/60 animate-fade-in">
                    ... +{seedWords.length - 4} more
                  </span>
                )}
                {animationState === "entering-seed" &&
                  seedWords.length < fullSeedPhrase.length && (
                    <span className="inline-block w-1 h-3 bg-indigo-400 animate-blink"></span>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Keys Generated */}
        <div
          className={`flex items-center gap-4 mb-4 pb-4 border-b border-slate-800 transition-all duration-300 ${
            activeStep >= 2 ? "opacity-100" : "opacity-60"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              activeStep === 2
                ? "bg-emerald-500/20 scale-100 border-2 border-emerald-400/50 animate-highlight"
                : activeStep > 2
                ? "bg-emerald-500/10 scale-100"
                : "bg-emerald-500/5 scale-95"
            }`}
          >
            <Unlock
              className={`w-6 h-6 transition-all duration-300 ${
                activeStep === 2
                  ? "text-emerald-400"
                  : activeStep > 2
                  ? "text-emerald-400/80"
                  : "text-emerald-400/30"
              }`}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 w-24 flex-shrink-0">
                Login Hash:
              </span>
              <div
                className={`flex-1 bg-slate-800/50 rounded px-2 py-1 border transition-all duration-300 ${
                  activeStep === 2
                    ? "border-emerald-500/50 shimmer-effect"
                    : activeStep > 2
                    ? "border-emerald-500/30"
                    : "border-slate-700/50"
                }`}
              >
                <div className="font-mono text-xs text-emerald-400 truncate">
                  {loginHash}
                  {animationState === "generating-keys" &&
                    loginHash.length < 48 && (
                      <span className="inline-block w-1 h-3 bg-emerald-400 animate-blink ml-0.5"></span>
                    )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 w-24 flex-shrink-0">
                Encrypt Key:
              </span>
              <div
                className={`flex-1 bg-slate-800/50 rounded px-2 py-1 border transition-all duration-300 ${
                  activeStep === 2
                    ? "border-blue-500/50 shimmer-effect"
                    : activeStep > 2
                    ? "border-blue-500/30"
                    : "border-slate-700/50"
                }`}
              >
                <div className="font-mono text-xs text-blue-400 truncate">
                  {encryptionKey}
                  {animationState === "generating-keys" &&
                    encryptionKey.length > 0 &&
                    encryptionKey.length < 48 && (
                      <span className="inline-block w-1 h-3 bg-blue-400 animate-blink ml-0.5"></span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Send to Server */}
        <div
          className={`flex items-center gap-4 mb-4 pb-4 border-b border-slate-800 transition-all duration-300 ${
            activeStep >= 3 ? "opacity-100" : "opacity-60"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              activeStep === 3
                ? "bg-purple-500/20 scale-100 border-2 border-purple-400/50 animate-highlight"
                : activeStep > 3
                ? "bg-purple-500/10 scale-100"
                : "bg-purple-500/5 scale-95"
            }`}
          >
            <Send
              className={`w-6 h-6 transition-all duration-300 ${
                activeStep === 3
                  ? "text-purple-400"
                  : activeStep > 3
                  ? "text-purple-400/80"
                  : "text-purple-400/30"
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">
              Verifying Identity
            </h3>
            <p
              className={`text-xs transition-all duration-300 ${
                activeStep === 3
                  ? "text-purple-300"
                  : activeStep > 3
                  ? "text-purple-300/80"
                  : "text-slate-500"
              }`}
            >
              Login hash sent to server...
            </p>
          </div>
        </div>

        {/* Step 4: Vault Unlocked */}
        <div
          className={`flex items-center gap-4 transition-all duration-700 ${
            activeStep >= 4
              ? "opacity-100 translate-y-0"
              : "opacity-60 translate-y-0"
          }`}
        >
          <div className="relative w-16 h-16 flex-shrink-0">
            {activeStep === 4 && (
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 border-r-purple-400 animate-rotate animate-glow"></div>
            )}

            {activeStep === 4 && (
              <div
                className="absolute inset-1 rounded-full border-2 border-transparent border-b-blue-500 border-l-blue-500 animate-rotate-reverse"
                style={{ animationDuration: "2.5s" }}
              ></div>
            )}

            {/* Inner ring - Shows when storing locally */}
            {activeStep === 4 && (
              <div className="absolute inset-2 rounded-full border border-cyan-400/50 animate-pulse-custom"></div>
            )}

            {/* Glowing dots - Different colors for different stages */}
            {activeStep === 4 && (
              <>
                {/* Purple for receiving encrypted key */}
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full -translate-x-1/2 -translate-y-1 animate-pulse-custom shadow-lg shadow-purple-400/50"></div>
                {/* Blue for decrypting */}
                <div
                  className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full -translate-x-1/2 translate-y-1 animate-pulse-custom shadow-lg shadow-blue-400/50"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                {/* Cyan for storing */}
                <div
                  className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-y-1/2 -translate-x-1 animate-pulse-custom shadow-lg shadow-cyan-400/50"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute right-0 top-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-y-1/2 translate-x-1 animate-pulse-custom shadow-lg shadow-cyan-400/50"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </>
            )}

            {/* Center vault icon */}
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeStep === 5
                  ? "bg-green-500/20 scale-100 border-2 border-green-400/50"
                  : activeStep === 4
                  ? "bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 scale-90 border-2 border-cyan-400/30 animate-highlight"
                  : activeStep > 4
                  ? "bg-green-500/10 scale-100"
                  : "bg-slate-500/10 scale-90"
              }`}
            >
              {activeStep === 5 ? (
                <CheckCircle className="w-8 h-8 text-green-400 scale-100" />
              ) : (
                <Vault
                  className={`w-8 h-8 transition-all duration-300 ${
                    activeStep === 4
                      ? "text-cyan-400 scale-75"
                      : activeStep > 4
                      ? "text-green-400/80 scale-100"
                      : "text-slate-400/30 scale-75"
                  }`}
                />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-white text-sm mb-1">
              Vault Unlock Process
            </h3>

            {activeStep === 5 ? (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-bold">Access Granted</span>
                </div>
                <div className="text-xs text-green-200/80">
                  Private key decrypted and stored locally ✓
                </div>
              </div>
            ) : activeStep === 4 ? (
              <div className="space-y-3">
                {/* Step 4.1: Receiving encrypted private key */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      animationState === "unlocking-vault"
                        ? "bg-purple-500/20 animate-pulse-custom"
                        : "bg-slate-700"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-purple-300">
                        Receiving encrypted private key...
                      </span>
                      {animationState === "unlocking-vault" && (
                        <span className="text-xs text-purple-400 animate-pulse-custom">
                          Receiving
                        </span>
                      )}
                    </div>
                    {animationState === "unlocking-vault" && (
                      <div className="mt-1 bg-slate-800/50 rounded px-2 py-1 border border-purple-500/30">
                        <div className="font-mono text-xs text-purple-400 truncate">
                          enc_3f8a7b...c92d1e
                          <span className="inline-block w-1 h-3 bg-purple-400 animate-blink ml-0.5"></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4.2: Decrypting with encryption key */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      animationState === "unlocking-vault"
                        ? "bg-blue-500/20 animate-pulse-custom"
                        : "bg-slate-700"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-300">
                        Decrypting with local encryption key...
                      </span>
                      {animationState === "unlocking-vault" && (
                        <span className="text-xs text-blue-400 animate-pulse-custom">
                          Decrypting
                        </span>
                      )}
                    </div>
                    {animationState === "unlocking-vault" && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 bg-slate-800/50 rounded px-2 py-1 border border-blue-500/30">
                          <div className="font-mono text-xs text-blue-400 truncate">
                            Using: {encryptionKey.substring(0, 24)}...
                            <span className="inline-block w-1 h-3 bg-blue-400 animate-blink ml-0.5"></span>
                          </div>
                        </div>
                        <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 bg-slate-800/50 rounded px-2 py-1 border border-green-500/30">
                          <div className="font-mono text-xs text-green-400 truncate">
                            0x8923...a4f1
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4.3: Storing decrypted key locally */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      animationState === "unlocking-vault"
                        ? "bg-cyan-500/20 animate-pulse-custom"
                        : "bg-slate-700"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-cyan-300">
                        Storing private key locally...
                      </span>
                      {animationState === "unlocking-vault" && (
                        <span className="text-xs text-cyan-400 animate-pulse-custom">
                          Securing
                        </span>
                      )}
                    </div>
                    {animationState === "unlocking-vault" && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 bg-slate-800/50 rounded px-2 py-1 border border-cyan-500/30">
                          <div className="font-mono text-xs text-cyan-400">
                            <div className="flex items-center justify-between">
                              <span>Secure Local Storage</span>
                              <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Waiting for backend verification...
                </p>
                <div className="text-xs text-slate-600">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <span>Receive encrypted private key</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <span>Decrypt with local encryption key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    <span>Store on browser</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Info - Compact */}
      <div
        className={`grid grid-cols-2 gap-3 mt-4 transition-all duration-700 ${
          activeStep === 5
            ? "opacity-100 translate-y-0"
            : "opacity-60 translate-y-0"
        }`}
      >
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-3 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-xs">Secure</h3>
          </div>
          <ul className="space-y-1">
            <li className="flex items-start gap-1.5 text-xs text-emerald-200">
              <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Local key generation</span>
            </li>
            <li className="flex items-start gap-1.5 text-xs text-emerald-200">
              <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Zero-knowledge proof</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-white text-xs">Private</h3>
          </div>
          <ul className="space-y-1">
            <li className="flex items-start gap-1.5 text-xs text-slate-400">
              <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>No seed exposure</span>
            </li>
            <li className="flex items-start gap-1.5 text-xs text-slate-400">
              <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>No key Directly send to Backend</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step2;
