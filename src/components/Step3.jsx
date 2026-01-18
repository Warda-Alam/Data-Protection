import { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Server, UnlockKeyhole,
  Key, Shield, Eye
} from 'lucide-react';

const Step3 = () => {
  // States: 0: idle, 1: show input, 2: processing encryption, 3: encryption complete, 
  // 4: start decryption, 5: processing decryption, 6: decryption complete, 7: final
  const [step, setStep] = useState(0);
  const [encryptionActive, setEncryptionActive] = useState(false);
  const [decryptionActive, setDecryptionActive] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      // Reset
      setEncryptionActive(false);
      setDecryptionActive(false);
      await new Promise(r => setTimeout(r, 500));
      
      setStep(1); // Show original data
      await new Promise(r => setTimeout(r, 1000));
      
      // Encryption starts
      setEncryptionActive(true);
      setStep(2); // Processing encryption
      await new Promise(r => setTimeout(r, 3000));
      
      setStep(3); // Encryption complete
      setEncryptionActive(false);
      await new Promise(r => setTimeout(r, 2000));
      
      // Decryption starts
      setDecryptionActive(true);
      setStep(4); // Start decryption (show encrypted data from server)
      await new Promise(r => setTimeout(r, 1000));
      
      setStep(5); // Processing decryption
      await new Promise(r => setTimeout(r, 3000));
      
      setStep(6); // Decryption complete
      setDecryptionActive(false);
      await new Promise(r => setTimeout(r, 2000));
      
      setStep(7); // Final state
      await new Promise(r => setTimeout(r, 8000));
      
      setStep(0); // Restart loop
    };

    if (step === 0) sequence();
  }, [step]);

  const isEncryptionStep = step >= 1 && step <= 3;
  const isDecryptionStep = step >= 4 && step <= 6;

  return (
    <div className="step-content">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
          End-to-End Encryption Flow
        </h2>
        <p className="text-slate-300 text-lg">Data is encrypted locally before transmission</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 relative">
        
        {/* --- ENCRYPTION COLUMN --- */}
        <div className={`bg-slate-900/50 rounded-xl p-8 border-2 relative overflow-hidden transition-all duration-300 ${
          isEncryptionStep ? 'border-rose-500/30' : 'border-slate-800'
        }`}>
          {/* Shining Border Effect */}
          <div className={`absolute inset-0 rounded-xl pointer-events-none ${
            encryptionActive ? 'animate-pulse' : ''
          }`} style={{
            boxShadow: encryptionActive ? '0 0 60px rgba(244, 63, 94, 0.2)' : 'none'
          }}></div>
          
          {/* Animated Ring Effect */}
          <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-rose-500/0 via-rose-500/20 to-rose-500/0 blur-xl transition-opacity duration-500 ${
            encryptionActive ? 'opacity-100' : 'opacity-0'
          }`}></div>

          <div className="text-center mb-8 relative z-10">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 relative ${
              step >= 2 ? 'bg-rose-500/20 scale-110' : 'bg-slate-800'
            }`}>
              <div className={`absolute inset-0 rounded-full bg-rose-500/30 ${
                encryptionActive ? 'animate-ping' : ''
              }`} style={{ animationDuration: '2s' }}></div>
              <Lock className={`w-10 h-10 ${
                step >= 2 ? 'text-rose-400' : 'text-slate-600'
              }`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Local Encryption</h3>
            <p className="text-sm text-slate-400">Your device → Secure Server</p>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Step 1: Original Data */}
            <div className={`transition-all duration-500 ${
              step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-rose-500/20' : 'bg-slate-800'
                }`}>
                  <Eye className={`w-4 h-4 ${step >= 1 ? 'text-rose-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-400 font-semibold flex-1">ORIGINAL DATA (YOUR DEVICE):</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  step >= 1 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-600'
                }`}>Step 1</span>
              </div>
              <div className={`bg-slate-800/50 rounded-lg p-4 border ${
                step >= 1 ? 'border-rose-500/20' : 'border-slate-700'
              }`}>
                <p className="text-sm text-slate-200">"Hello, this is my confidential message..."</p>
              </div>
            </div>

            {/* Step 2: Encryption Process */}
            <div className={`transition-all duration-500 ${
              step >= 2 ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-rose-500/20' : 'bg-slate-800'
                }`}>
                  <Key className={`w-4 h-4 ${step >= 2 ? 'text-rose-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-400 font-semibold flex-1">ENCRYPTION PROCESS:</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  step >= 2 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-600'
                }`}>Step 2</span>
              </div>
              <div className={`relative h-20 flex items-center justify-center rounded-lg border ${
                step >= 2 ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-700'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent ${
                    step === 2 ? 'animate-pulse' : ''
                  }`}></div>
                </div>
                <div className={`relative px-6 py-3 rounded-full backdrop-blur-sm ${
                  step >= 2 ? 'bg-slate-900 border border-rose-500/50' : 'bg-rose-500/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <Key className={`w-5 h-5 text-rose-400 ${
                      step === 2 ? 'animate-spin' : ''
                    }`} style={{ animationDuration: '2s' }} />
                    <span className="text-sm text-rose-300 font-mono">
                      {step === 2 ? "ENCRYPTING WITH AES-256..." : "ENCRYPTED"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Encrypted Result */}
            <div className={`transition-all duration-500 ${
              step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-rose-500/20' : 'bg-slate-800'
                }`}>
                  <Shield className={`w-4 h-4 ${step >= 3 ? 'text-rose-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-400 font-semibold flex-1">ENCRYPTED RESULT:</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  step >= 3 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-600'
                }`}>Step 3</span>
              </div>
              <div className={`rounded-lg p-4 border overflow-hidden relative ${
                step >= 3 ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-700'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent animate-shimmer"></div>
                <p className="text-xs font-mono text-rose-300 break-all relative z-10">
                  U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y96Qsv2Lm+31cmzaAILwyt
                </p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Encryption Status:</span>
                <span className={`font-mono ${
                  step >= 3 ? 'text-rose-400' : 'text-slate-500'
                }`}>
                  {step >= 3 ? 'COMPLETE ✓' : step >= 2 ? 'IN PROGRESS...' : 'WAITING'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- DECRYPTION COLUMN --- */}
        <div className={`bg-slate-900/50 rounded-xl p-8 border-2 relative overflow-hidden transition-all duration-300 ${
          isDecryptionStep ? 'border-teal-500/30' : 'border-slate-800'
        }`}>
          {/* Shining Border Effect */}
          <div className={`absolute inset-0 rounded-xl pointer-events-none ${
            decryptionActive ? 'animate-pulse' : ''
          }`} style={{
            boxShadow: decryptionActive ? '0 0 60px rgba(45, 212, 191, 0.2)' : 'none'
          }}></div>
          
          {/* Animated Ring Effect */}
          <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-teal-500/0 via-teal-500/20 to-teal-500/0 blur-xl transition-opacity duration-500 ${
            decryptionActive ? 'opacity-100' : 'opacity-0'
          }`}></div>

          <div className="text-center mb-8 relative z-10">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 relative ${
              step >= 5 ? 'bg-teal-500/20 scale-110' : 'bg-slate-800'
            }`}>
              <div className={`absolute inset-0 rounded-full bg-teal-500/30 ${
                decryptionActive ? 'animate-ping' : ''
              }`} style={{ animationDuration: '2s' }}></div>
              <Unlock className={`w-10 h-10 ${
                step >= 5 ? 'text-teal-400' : 'text-slate-600'
              }`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Local Decryption</h3>
            <p className="text-sm text-slate-400">Secure Server → Your Device</p>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Step 4: Encrypted Data from Server */}
            <div className={`transition-all duration-500 ${
              step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 4 ? 'bg-teal-500/20' : 'bg-slate-800'
                }`}>
                  <Server className={`w-4 h-4 ${step >= 4 ? 'text-teal-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-400 font-semibold flex-1">ENCRYPTED FROM SERVER:</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  step >= 4 ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-600'
                }`}>Step 1</span>
              </div>
              <div className={`bg-slate-800/50 rounded-lg p-4 border ${
                step >= 4 ? 'border-teal-500/20' : 'border-slate-700'
              }`}>
                <p className="text-xs font-mono text-slate-500 break-all">U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0...</p>
              </div>
            </div>

            {/* Step 5: Decryption Process */}
            <div className={`transition-all duration-500 ${
              step >= 5 ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 5 ? 'bg-teal-500/20' : 'bg-slate-800'
                }`}>
                  <UnlockKeyhole className={`w-4 h-4 ${step >= 5 ? 'text-teal-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-400 font-semibold flex-1">DECRYPTION PROCESS:</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  step >= 5 ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-600'
                }`}>Step 2</span>
              </div>
              <div className={`relative h-20 flex items-center justify-center rounded-lg border ${
                step >= 5 ? 'border-teal-500/30 bg-teal-500/5' : 'border-slate-700'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent ${
                    step === 5 ? 'animate-pulse' : ''
                  }`}></div>
                </div>
                <div className={`relative px-6 py-3 rounded-full backdrop-blur-sm ${
                  step >= 5 ? 'bg-slate-800 border border-teal-500/50' : 'bg-teal-500/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <UnlockKeyhole className={`w-5 h-5 text-teal-400 ${
                      step === 5 ? 'animate-bounce' : ''
                    }`} />
                    <span className="text-sm text-teal-300 font-mono">
                      {step === 5 ? "DECRYPTING WITH PRIVATE KEY..." : "READY"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: Decrypted Output */}
            <div className={`transition-all duration-500 ${
              step >= 6 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 6 ? 'bg-teal-500/20' : 'bg-slate-800'
                }`}>
                  <Eye className={`w-4 h-4 ${step >= 6 ? 'text-teal-400' : 'text-slate-600'}`} />
                </div>
                <p className="text-xs text-slate-400 font-semibold flex-1">DECRYPTED RESULT:</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  step >= 6 ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-600'
                }`}>Step 3</span>
              </div>
              <div className={`rounded-lg p-4 border ${
                step >= 6 ? 'border-teal-500/30 bg-teal-500/5' : 'border-slate-700'
              }`}>
                <p className="text-sm text-teal-200">"Hello, this is my confidential message..."</p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Decryption Status:</span>
                <span className={`font-mono ${
                  step >= 6 ? 'text-teal-400' : 'text-slate-500'
                }`}>
                  {step >= 6 ? 'COMPLETE ✓' : step >= 5 ? 'IN PROGRESS...' : 'WAITING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Info Boxes */}
      <div className={`grid sm:grid-cols-2 gap-4 mt-4 transition-all duration-1000 ${
        step >= 7 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-rose-400" />
            <h4 className="text-sm font-bold text-rose-300">Encryption Guarantee</h4>
          </div>
          <p className="text-xs text-rose-300/70">Your data is encrypted locally before transmission. The server only receives encrypted ciphertext that cannot be read without your private key.</p>
        </div>
        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Unlock className="w-5 h-5 text-teal-400" />
            <h4 className="text-sm font-bold text-teal-300">Local Decryption</h4>
          </div>
          <p className="text-xs text-teal-300/70">Decryption happens in your device's memory. We never have access to your plaintext data or decryption keys at any point.</p>
        </div>
      </div>
    </div>
  );
};

export default Step3;