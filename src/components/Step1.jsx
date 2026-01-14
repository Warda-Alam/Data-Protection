import React, { useState, useEffect } from "react";
import {
  Key,
  Vault,
  Smartphone,
  Server,
  AlertTriangle,
  Check,
  X,
  ArrowDown,
  Globe,
  LockKeyhole,
  ChevronLeft,
} from "lucide-react";
import EncryptionKeyBlock from "./EncryptionKeyBlock";
import SecureWrappingLoop from "./SecureWrappingLoop";
import SeedPhraseFlow from "./SeedPhraseFlow";
import IdentityHashBlock from "./IndentityHash";

const Step1 = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);

  useEffect(() => {
    const timeouts = { 1: 3000, 2: 3000, 3: 3000, 4: 3000, 5: 5000 };

    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, timeouts[activeStep]);

    return () => clearTimeout(timer);
  }, [activeStep]);

const getStepStyle = (step) => {
  const base = "transition-all duration-500 transform rounded-xl border";

  // 1. ACTIVE STEP: The "Hero" - Brightest with a purple glow
  if (activeStep === step) {
    return `
      ${base}
      scale-[1.02]
      border-purple-500
      bg-slate-800
      shadow-[0_0_25px_rgba(168,85,247,0.2)]
      opacity-100
      z-20
    `;
  }

  // 2. COMPLETED STEPS: The "Done" state - Fully opaque, no blur, solid border
  // We use a slightly darker bg than active, but 100% opacity so it's not dim.
  if (step < activeStep) {
    return `
      ${base}
      scale-100
      border-slate-600
      bg-slate-800/90
      opacity-100
      z-10
    `;
  }

  // 3. FUTURE STEPS: Truly dimmed to focus the user on the current progress
  return `
    ${base}
    scale-100
    border-slate-800
    bg-slate-900/40
    opacity-30
  `;
};

  return (
    <div className="step-content max-w-6xl mx-auto p-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Zero-Knowledge Key Generation
        </h2>
        <p className="text-slate-400">
          Everything is generated locally. The server only sees what you allow.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 relative items-start">
        {/* Left Side: Process Flow */}
        <div className="space-y-4 relative">
          {/* 1. Seed Phrase */}
          <div className={getStepStyle(1)}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors 
                  ${activeStep >= 1 ? "bg-purple-600" : "bg-slate-700"}`}
                >
                  <Key
                    className={`w-6 h-6 ${
                      activeStep >= 1 ? "text-white" : "text-slate-400"
                    }`}
                  />{" "}
                </div>
                <h3 className="font-semibold text-white">
                  1. Seed Phrase Created
                </h3>
              </div>
              <SeedPhraseFlow isActive={activeStep === 1} />
            </div>
          </div>

          {/* 2. Identity Hash */}
          <div className={getStepStyle(2)}>
            <IdentityHashBlock activeStep={activeStep} isActive={activeStep === 2} />
          </div>

          {/* 3. Encryption Key */}
          <div className={getStepStyle(3)}>
            <EncryptionKeyBlock  activeStep={activeStep} isActive={activeStep === 3} />
          </div>

          {/* 4. PGP Keys */}
          <div className={getStepStyle(4)}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    activeStep >= 4 ? "bg-violet-500" : "bg-slate-700"
                  }`}
                >
                  <Vault
                    className={`w-6 h-6 ${
                      activeStep >= 4 ? "text-white" : "text-slate-400"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-white">4. Secure Key Pair</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-2 text-center">
                  <Globe className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <span className="text-[10px] text-blue-300 font-medium">
                    Public Key
                  </span>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-center">
                  <LockKeyhole className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <span className="text-[10px] text-red-300 font-medium">
                    Private Key
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Wrapping */}
          <div className={getStepStyle(5)}>
            <SecureWrappingLoop isActive={activeStep === 5} />
          </div>
        </div>

        {/* --- MIDDLE DATA PACKET ANIMATION --- */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800/50">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-700 ease-in-out"
            style={{
              top: `${(activeStep - 1) * 20 + 5}%`,
              opacity: activeStep === 5 ? 0 : 1,
            }}
          >
            <ChevronLeft className="text-white w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Right Side: Visual State (Static summary) */}
        <div className="lg:sticky lg:top-12">
          <div className="bg-slate-900/70 rounded-2xl p-8 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>

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
                  <StatusItem
                    active={activeStep >= 1}
                    label="Seed phrase stored"
                  />
                  <StatusItem
                    active={activeStep >= 3}
                    label="Encryption key created"
                  />
                  <StatusItem
                    active={activeStep >= 5}
                    label="Private key encrypted"
                  />
                </div>
              </div>
            </div>

            {/* Data Flow Animation */}
            <div className="relative h-16 mb-8 flex justify-center">
              <div className="flex flex-col items-center">
                <ArrowDown className="w-6 h-6 text-purple-400 animate-bounce" />
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
                  <StatusItem
                    active={activeStep >= 2}
                    label="Identity hash stored"
                    color="blue"
                  />
                  <StatusItem
                    active={activeStep >= 4}
                    label="Public key stored"
                    color="blue"
                  />
                  <div className="flex items-center gap-2 text-sm text-red-400/80 italic">
                    <X className="w-4 h-4" />
                    <span>No access to seed/private keys</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              Your seed phrase is the master key. Write it down and keep it
              safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ active, label, color = "emerald" }) => (
  <div
    className={`flex items-center gap-2 text-sm transition-all duration-500 ${
      active
        ? `text-${color}-400 opacity-100 font-medium`
        : "text-slate-600 opacity-40"
    }`}
  >
    <Check className={`w-4 h-4 ${active ? "scale-110" : "scale-100"}`} />
    <span>{label}</span>
  </div>
);

export default Step1;
