import React, { useState, useEffect } from 'react';
import { 
  Key, Unlock, Vault, ShieldCheck, EyeOff, Check, 
  X, ArrowRight, Send, CheckCircle, 
  Info
} from 'lucide-react';

const Step2 = () => {
  const [animationState, setAnimationState] = useState('idle');
  const [seedWords, setSeedWords] = useState([]);
  const [loginHash, setLoginHash] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showServerSend, setShowServerSend] = useState(false);
  const [showVaultUnlock, setShowVaultUnlock] = useState(false);

  const fullSeedPhrase = [
    'apple', 'bridge', 'castle', 'dragon', 'eagle', 'forest',
    'garden', 'harbor', 'island', 'jungle', 'kingdom', 'lighthouse',
    'mountain', 'nature', 'ocean', 'palace'
  ];

  const generateRandomHash = (length) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const resetAnimation = () => {
    setAnimationState('idle');
    setSeedWords([]);
    setLoginHash('');
    setEncryptionKey('');
    setShowServerSend(false);
    setShowVaultUnlock(false);
  };

  useEffect(() => {
    const startSequence = setTimeout(() => {
      setAnimationState('entering-seed');
    }, 500);

    return () => clearTimeout(startSequence);
  }, []);

  useEffect(() => {
    if (animationState === 'entering-seed') {
      fullSeedPhrase.forEach((word, index) => {
        setTimeout(() => {
          setSeedWords(prev => [...prev, word]);

          if (index === fullSeedPhrase.length - 1) {
            setTimeout(() => {
              setAnimationState('generating-keys');
            }, 300);
          }
        }, index * 40);
      });
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === 'generating-keys') {
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
        setAnimationState('sending-to-server');
      }, 1500);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === 'sending-to-server') {
      setTimeout(() => {
        setShowServerSend(true);
      }, 200);

      setTimeout(() => {
        setAnimationState('unlocking-vault');
      }, 1200);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === 'unlocking-vault') {
      setTimeout(() => {
        setShowVaultUnlock(true);
      }, 600);

      setTimeout(() => {
        setAnimationState('complete');
      }, 1800);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState === 'complete') {
      setTimeout(() => {
        resetAnimation();
        setTimeout(() => {
          setAnimationState('entering-seed');
        }, 500);
      }, 5000);
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
        <p className="text-slate-400 text-sm">Secure access without passwords</p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-5 border border-indigo-500/20 shadow-2xl">
        {/* Step 1: Enter Seed */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
            animationState !== 'idle' ? 'bg-indigo-500/20 scale-100' : 'bg-indigo-500/5 scale-95'
          }`}>
            <Key className={`w-6 h-6 transition-all duration-500 ${
              animationState !== 'idle' ? 'text-indigo-400' : 'text-indigo-400/30'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">Enter Seed Phrase</h3>
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <div className="flex flex-wrap gap-1 text-xs font-mono">
                {seedWords.slice(0, 4).map((word, index) => (
                  <span key={index} className="text-indigo-300 animate-fade-in">
                    {word}{index < 3 && ','}
                  </span>
                ))}
                {seedWords.length > 4 && (
                  <span className="text-indigo-400/60 animate-fade-in">
                    ... +{seedWords.length - 4} more
                  </span>
                )}
                {animationState === 'entering-seed' && seedWords.length < fullSeedPhrase.length && (
                  <span className="inline-block w-1 h-3 bg-indigo-400 animate-blink"></span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Keys Generated */}
        <div className={`transition-all duration-500 ${
          animationState === 'generating-keys' || animationState === 'sending-to-server' || animationState === 'unlocking-vault' || animationState === 'complete'
            ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/20">
              <Unlock className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 w-24 flex-shrink-0">Login Hash:</span>
                <div className="flex-1 bg-slate-800/50 rounded px-2 py-1 border border-emerald-500/30 shimmer-effect">
                  <div className="font-mono text-xs text-emerald-400 truncate">
                    {loginHash}
                    {animationState === 'generating-keys' && loginHash.length < 48 && (
                      <span className="inline-block w-1 h-3 bg-emerald-400 animate-blink ml-0.5"></span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-300 w-24 flex-shrink-0">Encrypt Key:</span>
                <div className="flex-1 bg-slate-800/50 rounded px-2 py-1 border border-blue-500/30 shimmer-effect">
                  <div className="font-mono text-xs text-blue-400 truncate">
                    {encryptionKey}
                    {animationState === 'generating-keys' && encryptionKey.length > 0 && encryptionKey.length < 48 && (
                      <span className="inline-block w-1 h-3 bg-blue-400 animate-blink ml-0.5"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Send to Server */}
        <div className={`transition-all duration-500 ${
          showServerSend ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500/20 shimmer-effect">
              <Send className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm mb-1">Verifying Identity</h3>
              <p className="text-xs text-purple-300">Login hash sent to server...</p>
            </div>
          </div>
        </div>

        {/* Step 4: Vault Unlocked */}
        <div className={`transition-all duration-700 ${
          showVaultUnlock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              {/* Outer glowing ring */}
              {animationState === 'unlocking-vault' && (
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-cyan-400 animate-rotate animate-glow"></div>
              )}
              
              {/* Middle ring */}
              {animationState === 'unlocking-vault' && (
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-cyan-500 border-l-cyan-500 animate-rotate-reverse" style={{ animationDuration: '2.5s' }}></div>
              )}
              
              {/* Inner ring */}
              {animationState === 'unlocking-vault' && (
                <div className="absolute inset-2 rounded-full border border-cyan-400/50 animate-pulse-custom"></div>
              )}
              
              {/* Glowing dots */}
              {animationState === 'unlocking-vault' && (
                <>
                  <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1 animate-pulse-custom shadow-lg shadow-cyan-400/50"></div>
                  <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2 translate-y-1 animate-pulse-custom shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-y-1/2 -translate-x-1 animate-pulse-custom shadow-lg shadow-cyan-400/50" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute right-0 top-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-y-1/2 translate-x-1 animate-pulse-custom shadow-lg shadow-cyan-400/50" style={{ animationDelay: '1.5s' }}></div>
                </>
              )}
              
              {/* Center vault icon */}
              <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-1000 ${
                animationState === 'complete'
                  ? 'bg-cyan-500/20 scale-100' 
                  : 'bg-cyan-500/10 scale-90'
              }`}>
                <Vault className={`w-8 h-8 text-cyan-400 transition-all duration-1000 ${
                  animationState === 'complete' ? 'scale-100' : 'scale-75'
                }`} />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm mb-1">Vault Unlocked</h3>
              {animationState === 'complete' ? (
                <div className="flex items-center gap-2 text-cyan-300 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">Access Granted</span>
                </div>
              ) : (
                <p className="text-xs text-cyan-300">Decrypting private key...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Info - Compact */}
      <div className={`grid grid-cols-2 gap-3 mt-4 transition-all duration-700 ${
        animationState === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
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