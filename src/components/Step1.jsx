import React, { useState, useEffect } from "react";
import {
  Key,
  Hash,
  Vault,
  Smartphone,
  Server,
  AlertTriangle,
  Check,
  X,
  ArrowDown,
  Globe,
  LockKeyhole,
  ChevronRight,
} from "lucide-react";
import EncryptionKeyBlock from "./EncryptionKeyBlock";
import SecureWrappingLoop from "./SecureWrappingLoop";
import SeedPhraseFlow from "./SeedPhraseFlow";
import IdentityHashBlock from "./IndentityHash";

const Step1 = () => {
  const [activeStep, setActiveStep] = useState(1);

  const seedWords = [
    "apple",
    "bridge",
    "castle",
    "dragon",
    "eagle",
    "forest",
    "garden",
    "harbor",
  ];

  useEffect(() => {
    let timer;
    const timeouts = { 1: 3000, 2: 3000, 3: 3000, 4: 3000, 5: 5000 };

    timer = setTimeout(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, timeouts[activeStep]);

    return () => clearTimeout(timer);
  }, [activeStep]);

  // Style helper for focus effect
  const getStepStyle = (step) => {
    const isActive = activeStep === step;
    return `transition-all duration-500 transform ${
      isActive
        ? "scale-[1.02] border-purple-500/50 bg-slate-800/80 shadow-[0_0_20px_rgba(168,85,247,0.15)] opacity-100 z-10"
        : "scale-100 border-slate-800 opacity-40 grayscale-[0.5]"
    }`;
  };

  return (
    <div className="step-content">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Zero-Knowledge Key Generation
        </h2>
        <p className="text-slate-400">
          Everything is generated locally. The server only sees what you allow.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 relative">
        {/* Left Side: Process Flow */}
        <div className="space-y-6">
          {/* 1. Seed Phrase */}
          <div className={`${getStepStyle(1)} rounded-xl p-6 border`}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  activeStep === 1 ? "bg-purple-500" : "bg-slate-700"
                }`}
              >
                <Key
                  className={`w-6 h-6 ${
                    activeStep === 1 ? "text-white" : "text-slate-400"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-white">
                1. Seed Phrase Created
              </h3>
            </div>
            <SeedPhraseFlow isActive={activeStep === 1} />
          </div>

          {/* 2. Identity Hash */}
          <div className={`${getStepStyle(2)} rounded-xl border`}>
          <IdentityHashBlock isActive={activeStep === 2} /></div>

          {/* 3. Encryption Key */}
          <div className={`${getStepStyle(3)} rounded-xl border`}>
            <EncryptionKeyBlock isActive={activeStep === 3} />
          </div>

          {/* 4. PGP Keys */}
          <div className={`${getStepStyle(4)} rounded-xl p-6 border`}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  activeStep === 4 ? "bg-violet-500" : "bg-slate-700"
                }`}
              >
                <Vault
                  className={`w-6 h-6 ${
                    activeStep === 4 ? "text-white" : "text-slate-400"
                  }`}
                />
              </div>
              <h3 className="font-semibold text-white">4. Secure Key Pair</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-2 text-center">
                <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] text-blue-300">Public Key</span>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-center">
                <LockKeyhole className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <span className="text-[10px] text-red-300">Private Key</span>
              </div>
            </div>
          </div>

          {/* 5. Wrapping */}
          <div
            className={`${getStepStyle(5)} rounded-xl border overflow-hidden`}
          >
            <SecureWrappingLoop isActive={activeStep === 5} />
          </div>
        </div>

        {/* --- MIDDLE DATA PACKET ANIMATION --- */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-in-out"
            style={{
              top: `${(activeStep - 1) * 22}%`,
              opacity: activeStep === 5 ? 0 : 1,
            }}
          >
            <ChevronRight className="text-white w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Right Side: Visual State */}
        <div className="flex flex-col justify-center">
          <div className="bg-slate-900/70 rounded-2xl p-8 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer opacity-20"></div>

            {/* Device */}
            <div className="relative z-10 mb-8">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-8 h-8 text-purple-400" />
                  <h3 className="font-semibold text-white text-lg">
                    Your Device
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <Check className="w-4 h-4" />
                    <span>Seed phrase stored</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <Check className="w-4 h-4" />
                    <span>Encryption key created</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <Check className="w-4 h-4" />
                    <span>Private key encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Flow Animation */}
            <div className="relative h-24 mb-8">
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <ArrowDown className="w-6 h-6 text-purple-400 animate-data-flow" />
              </div>
              <div
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ animationDelay: "0.5s" }}
              >
                <ArrowDown className="w-6 h-6 text-pink-400 animate-data-flow" />
              </div>
              <div
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ animationDelay: "1s" }}
              >
                <ArrowDown className="w-6 h-6 text-purple-400 animate-data-flow" />
              </div>
            </div>

            {/* Server */}
            <div className="relative z-10">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-8 h-8 text-slate-400" />
                  <h3 className="font-semibold text-white text-lg">Server</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <Check className="w-4 h-4" />
                    <span>Identity hash stored</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <Check className="w-4 h-4" />
                    <span>Public key stored</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <X className="w-4 h-4" />
                    <span>Cannot see seed phrase</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-300">
                    <X className="w-4 h-4" />
                    <span>Cannot decrypt private key</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              Your seed phrase is the master key. Write it down and keep it safe
              - it's your only way to recover access!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
