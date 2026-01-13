import React from "react";
import {
  Key,
  Hash,
  Lock,
  Vault,
  Smartphone,
  Server,
  AlertTriangle,
  Check,
  X,
  ArrowDown,
  Globe,
  LockKeyhole,
} from "lucide-react";
import EncryptionKeyBlock from "./EncryptionKeyBlock";
import SecureWrappingLoop from "./SecureWrappingLoop";

const Step1 = () => {
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

  return (
    <div className="step-content">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Signup & Key Generation
        </h2>
        <p className="text-slate-300 text-lg">
          Watch how your security is created
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Side: Process Flow */}
        <div className="space-y-2">
          {/* Seed Phrase Generation */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/10 animate-slide-right">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  1. Seed Phrase Created
                </h3>
                <p className="text-xs text-slate-400">16 random words</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {seedWords.map((word, index) => (
                <div
                  key={index}
                  className="bg-slate-700/50 rounded px-2 py-1 text-xs font-mono text-center animate-slide-down"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {word}
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">
              ... and 8 more words
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-purple-400 animate-pulse-custom" />
          </div>

          {/* Hash Generation */}
          <div
            className="bg-slate-900/50 rounded-xl p-6 border border-blue-500/10 animate-slide-right"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">2. Identity Hash</h3>
                <p className="text-xs text-slate-400">One-way conversion</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 font-mono text-xs text-blue-300 break-all animate-encrypt">
              7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-purple-400 animate-pulse-custom" />
          </div>

          {/* Encryption Key */}
          <EncryptionKeyBlock />

          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-purple-400 animate-pulse-custom" />
          </div>

          {/* PGP Keys */}
          <div
            className="bg-slate-900/50 rounded-xl p-6 border border-violet-500/10 animate-slide-right"
            style={{ animationDelay: "0.9s" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <Vault className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  4. Key Pair Generated
                </h3>
                <p className="text-xs text-slate-400">Public + Private keys</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                <Globe className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-blue-300">Public Key</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <LockKeyhole className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <p className="text-xs text-red-300">Private Key</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-purple-400 animate-pulse-custom" />
          </div>
          <SecureWrappingLoop />
        </div>

        {/* Right Side: Visual Representation */}
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
