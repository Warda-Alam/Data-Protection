import React from 'react';
import { 
  Lock, Unlock, Server, Smartphone, UnlockKeyhole,
  CheckCircle, Key
} from 'lucide-react';

const Step3 = () => {
  return (
    <div className="step-content">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
          Data Encryption & Decryption
        </h2>
        <p className="text-slate-300 text-lg">How your data stays private</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Encryption Process */}
        <div className="bg-slate-900/50 rounded-xl p-8 border border-rose-500/10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Encryption</h3>
            <p className="text-sm text-slate-400">Before saving data</p>
          </div>

          <div className="space-y-6">
            {/* Original Data */}
            <div className="animate-slide-down">
              <p className="text-xs text-slate-400 mb-2">Your Original Data:</p>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-slate-200">
                  Hello, this is my secret message that I want to keep private.
                </p>
              </div>
            </div>

            {/* Encryption Animation */}
            <div className="relative h-20 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
              </div>
              <div className="relative bg-slate-900 px-6 py-3 rounded-full border border-rose-500/30">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-rose-400" />
                  <span className="text-sm text-rose-300 font-medium">Encrypting</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse-custom"></div>
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse-custom" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse-custom" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Encrypted Data */}
            <div className="animate-slide-down" style={{ animationDelay: '0.3s' }}>
              <p className="text-xs text-slate-400 mb-2">Encrypted Data:</p>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-rose-500/30">
                <p className="text-xs font-mono text-rose-300 break-all animate-encrypt">
                  U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y96Qsv2Lm+31cmzaAILwytJ/IQ7ovJXQsEgrQ9Ufzrcw==
                </p>
              </div>
            </div>

            {/* Server Storage */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 text-center animate-slide-down" style={{ animationDelay: '0.6s' }}>
              <Server className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Stored on server (unreadable)</p>
            </div>
          </div>
        </div>

        {/* Decryption Process */}
        <div className="bg-slate-900/50 rounded-xl p-8 border border-teal-500/10">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Unlock className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Decryption</h3>
            <p className="text-sm text-slate-400">When viewing data</p>
          </div>

          <div className="space-y-6">
            {/* Server Sends */}
            <div className="animate-slide-down">
              <p className="text-xs text-slate-400 mb-2">Server Sends:</p>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-xs font-mono text-slate-400 break-all">
                  U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y96Qsv2Lm+31cmzaAILwytJ/IQ7ovJXQsEgrQ9Ufzrcw==
                </p>
              </div>
            </div>

            {/* Decryption Animation */}
            <div className="relative h-20 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
              </div>
              <div className="relative bg-slate-900 px-6 py-3 rounded-full border border-teal-500/30">
                <div className="flex items-center gap-3">
                  <UnlockKeyhole className="w-5 h-5 text-teal-400" />
                  <span className="text-sm text-teal-300 font-medium">Decrypting</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse-custom"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse-custom" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse-custom" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decrypted Data */}
            <div className="animate-slide-down" style={{ animationDelay: '0.3s' }}>
              <p className="text-xs text-slate-400 mb-2">Decrypted Data:</p>
              <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/30">
                <p className="text-sm text-teal-200">
                  Hello, this is my secret message that I want to keep private.
                </p>
              </div>
            </div>

            {/* Browser Only */}
            <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/30 text-center animate-slide-down" style={{ animationDelay: '0.6s' }}>
              <Smartphone className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-xs text-teal-300 font-medium">Decrypted in browser only</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-rose-200 font-medium mb-1">Encryption</p>
            <p className="text-xs text-rose-300/70">Data is locked before leaving your device</p>
          </div>
        </div>
        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 flex items-start gap-3">
          <Unlock className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-teal-200 font-medium mb-1">Decryption</p>
            <p className="text-xs text-teal-300/70">Only happens in your browser, never on server</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;