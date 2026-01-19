import React, { useState, useEffect } from "react";
import {
  Key,
  Lock,
  Link,
  FileText,
  Shield,
  CheckCircle,
  Upload,
  Download,
  ExternalLink,
  Copy,
} from "lucide-react";

const EncryptionFlowAnimation = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));
  const [symmetricKey, setSymmetricKey] = useState("");
  const [originalMessage, setOriginalMessage] = useState("");
  const [encryptedBlob, setEncryptedBlob] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  // Initialize with mock data
  useEffect(() => {
    const key =
      "AES-256-" + Math.random().toString(36).substring(2, 12).toUpperCase();
    const message = "Hello! This is a secret message.";
    const blob = btoa(message + "::" + key).replace(/=/g, "");
    const url = `https://secure-share.app/msg#key=${key}&data=${blob.substring(0, 20)}`;

    setSymmetricKey(key);
    setOriginalMessage(message);
    setEncryptedBlob(blob);
    setGeneratedUrl(url);
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= 6) {
          // Reset completed steps when cycle restarts
          setCompletedSteps(new Set([1]));
          return 1;
        }

        const nextStep = prev + 1;
        // Mark the previous step as completed
        setCompletedSteps((prevSet) => new Set([...prevSet, nextStep]));
        return nextStep;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Manually advance steps
  const handleNextStep = () => {
    setActiveStep((prev) => {
      if (prev >= 6) {
        // Reset completed steps when cycle restarts
        setCompletedSteps(new Set([1]));
        return 1;
      }

      const nextStep = prev + 1;
      // Mark the previous step as completed
      setCompletedSteps((prevSet) => new Set([...prevSet, nextStep]));
      return nextStep;
    });
  };

  // Helper to check if a step should be active
  const isStepActive = (step) => {
    return completedSteps.has(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            End-to-End Encryption Flow
          </h1>
          <p className="text-slate-400 text-lg">
            Secure message sharing with URL-embedded encryption keys
          </p>
        </div>

        {/* Main Flow Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* LEFT SIDE: Encryption Process */}
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-cyan-400 flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Sender Side
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Encryption & Sharing
              </p>
            </div>

            {/* Step 1: Generate Key */}
            <EncryptionStep1
              isActive={activeStep === 1}
              isCompleted={isStepActive(1)}
              symmetricKey={symmetricKey}
            />

            {/* Step 2: Encrypt Message */}
            <EncryptionStep2
              isActive={activeStep === 2}
              isCompleted={isStepActive(2)}
              symmetricKey={symmetricKey}
              originalMessage={originalMessage}
              encryptedBlob={encryptedBlob}
            />

            {/* Step 3: Generate URL with Key */}
            <EncryptionStep3
              isActive={activeStep === 3}
              isCompleted={isStepActive(3)}
              symmetricKey={symmetricKey}
              generatedUrl={generatedUrl}
            />
          </div>

          {/* RIGHT SIDE: Decryption Process */}
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-pink-400 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Receiver Side
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Receiving & Decryption
              </p>
            </div>

            {/* Step 4: Receive URL */}
            <DecryptionStep3
              isActive={activeStep === 4}
              isCompleted={isStepActive(4)}
              generatedUrl={generatedUrl}
            />

            {/* Step 5: Extract Key from URL */}
            <DecryptionStep2
              isActive={activeStep === 5}
              isCompleted={isStepActive(5)}
              symmetricKey={symmetricKey}
            />

            {/* Step 6: Decrypt Message */}
            <DecryptionStep1
              isActive={activeStep === 6}
              isCompleted={isStepActive(6)}
              symmetricKey={symmetricKey}
              originalMessage={originalMessage}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-sm text-cyan-400 mb-1">Encryption</div>
              <div className="flex gap-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={`enc-${step}`}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      activeStep === step
                        ? "bg-cyan-500 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        : isStepActive(step)
                          ? "bg-cyan-400 opacity-80"
                          : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-purple-400 mb-1">Sharing</div>
              <div className="flex gap-1">
                {[4].map((step) => (
                  <div
                    key={`share-${step}`}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      activeStep === step
                        ? "bg-purple-500 scale-125 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                        : isStepActive(step)
                          ? "bg-purple-400 opacity-80"
                          : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-pink-400 mb-1">Decryption</div>
              <div className="flex gap-1">
                {[5, 6].map((step) => (
                  <div
                    key={`dec-${step}`}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      activeStep === step
                        ? "bg-pink-500 scale-125 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                        : isStepActive(step)
                          ? "bg-pink-400 opacity-80"
                          : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Next Step
            </button>
            <div className="mt-2 text-xs text-slate-400">
              Step {activeStep} of 6:{" "}
              {activeStep === 1
                ? "Generate Key"
                : activeStep === 2
                  ? "Encrypt Message"
                  : activeStep === 3
                    ? "Create URL"
                    : activeStep === 4
                      ? "Receive URL"
                      : activeStep === 5
                        ? "Extract Key"
                        : "Decrypt Message"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Encryption Step 1: Generate Symmetric Key - Fixed height
const EncryptionStep1 = ({ isActive, isCompleted, symmetricKey }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setGenerating(true);
      setProgress(0);

      const progressTimer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(progressTimer);
            setTimeout(() => setGenerating(false), 300);
            return 100;
          }
          return p + 20;
        });
      }, 100);

      return () => clearInterval(progressTimer);
    } else {
      if (isCompleted) {
        setProgress(100);
        setGenerating(false);
      } else {
        setProgress(0);
        setGenerating(false);
      }
    }
  }, [isActive, isCompleted]);

  return (
    <div
      className={`relative bg-slate-800/50 rounded-xl p-6 border overflow-hidden transition-all duration-500 min-h-[280px] flex flex-col ${
        isActive
          ? "border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-105"
          : isCompleted
            ? "border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            : "border-slate-700 opacity-50"
      }`}
    >
      {isActive && (
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-xl transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-cyan-500/20 rotate-0"
                : isCompleted
                  ? "bg-cyan-400/20"
                  : "bg-slate-700/50"
            }`}
          >
            <Key
              className={`w-6 h-6 transition-colors ${
                isActive
                  ? "text-cyan-400 animate-pulse"
                  : isCompleted
                    ? "text-cyan-400"
                    : "text-slate-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Generate Symmetric Key</h3>
            <p className="text-xs text-slate-400">AES-256 encryption key</p>
          </div>
        </div>
        {(progress === 100 || isCompleted) && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Ready</span>
          </div>
        )}
      </div>

      <div className="space-y-3 flex-1">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Key Length:</span>
            <span className="text-xs text-cyan-400">256-bit</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Algorithm:</span>
            <span className="text-xs text-cyan-400">AES-GCM</span>
          </div>
        </div>

        <div
          className={`bg-black/40 rounded-lg p-4 font-mono text-sm flex-1 flex flex-col justify-center transition-all duration-300 ${
            isActive
              ? "border border-cyan-500/50"
              : isCompleted
                ? "border border-cyan-400/30"
                : ""
          }`}
        >
          <div className="text-xs text-slate-400 mb-1">Generated Key:</div>
          <div
            className={`flex items-center justify-between ${
              generating ? "animate-pulse" : ""
            }`}
          >
            <span
              className={`transition-colors truncate ${
                isActive
                  ? "text-cyan-400"
                  : isCompleted
                    ? "text-cyan-400/80"
                    : "text-slate-600"
              }`}
            >
              {generating ? "Generating..." : symmetricKey}
            </span>
            {!generating && symmetricKey && isCompleted && (
              <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Encryption Step 2: Encrypt Message - Fixed height
const EncryptionStep2 = ({
  isActive,
  isCompleted,
  symmetricKey,
  originalMessage,
  encryptedBlob,
}) => {
  const [encrypting, setEncrypting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setEncrypting(true);
      setProgress(0);

      const progressTimer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(progressTimer);
            setTimeout(() => setEncrypting(false), 300);
            return 100;
          }
          return p + 25;
        });
      }, 100);

      return () => clearInterval(progressTimer);
    } else {
      if (isCompleted) {
        setProgress(100);
        setEncrypting(false);
      } else {
        setProgress(0);
        setEncrypting(false);
      }
    }
  }, [isActive, isCompleted]);

  return (
    <div
      className={`relative bg-slate-800/50 overflow-hidden rounded-xl p-6 border transition-all duration-500 min-h-[300px] flex flex-col ${
        isActive
          ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-105"
          : isCompleted
            ? "border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            : "border-slate-700 opacity-50"
      }`}
    >
      {/* Progress bar at top - always visible when isActive */}
      {isActive && (
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg transition-all ${
              isActive
                ? "bg-purple-500/20"
                : isCompleted
                  ? "bg-purple-400/20"
                  : "bg-slate-700/50"
            }`}
          >
            <Lock
              className={`w-6 h-6 transition-colors ${
                isActive
                  ? "text-purple-400 animate-pulse"
                  : isCompleted
                    ? "text-purple-400"
                    : "text-slate-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Encrypt Message</h3>
            <p className="text-xs text-slate-400">Using generated key</p>
          </div>
        </div>
        {(progress === 100 || isCompleted) && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-lg p-3 transition-all ${
              isActive || isCompleted
                ? "bg-blue-500/10 border border-blue-500/20"
                : "bg-slate-900/50 border border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText
                className={`w-4 h-4 ${
                  isActive || isCompleted ? "text-blue-400" : "text-slate-500"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive || isCompleted ? "text-blue-300" : "text-slate-500"
                }`}
              >
                Input
              </span>
            </div>
            <p className="text-xs text-slate-300">{originalMessage}</p>
          </div>

          <div
            className={`rounded-lg p-3 transition-all ${
              isActive || isCompleted
                ? "bg-purple-500/10 border border-purple-500/20"
                : "bg-slate-900/50 border border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Key
                className={`w-4 h-4 ${
                  isActive || isCompleted ? "text-purple-400" : "text-slate-500"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive || isCompleted ? "text-purple-300" : "text-slate-500"
                }`}
              >
                Key Used
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate">{symmetricKey}</p>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 flex-1 flex flex-col transition-all ${
            isActive || isCompleted ? "bg-black/40" : "bg-black/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Encrypted Output:</span>
            <span className="text-xs text-purple-400">Base64</span>
          </div>
          <div
            className={`font-mono text-xs p-3 rounded transition-all duration-300 flex-1 flex items-center ${
              isActive
                ? "border border-purple-500/30"
                : isCompleted
                  ? "border border-purple-400/20"
                  : "bg-black/50"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={`break-all transition-colors ${
                  encrypting
                    ? "text-purple-400/50"
                    : isActive || isCompleted
                      ? "text-purple-400"
                      : "text-slate-600"
                }`}
              >
                {encrypting ? "Encrypting..." : encryptedBlob}
              </span>
              {!encrypting && isCompleted && (
                <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Encryption Step 3: Generate URL with Key - Fixed height
const EncryptionStep3 = ({
  isActive,
  isCompleted,
  symmetricKey,
  generatedUrl,
}) => {
  const [buildingUrl, setBuildingUrl] = useState(false);
  const [urlParts, setUrlParts] = useState([]);

  useEffect(() => {
    if (isActive && symmetricKey) {
      setBuildingUrl(true);
      setUrlParts([]);

      const parts = [
        "https://",
        "secure-share.app/",
        "msg#",
        "key=",
        symmetricKey,
        "&",
        "data=",
        "encrypted_data...",
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i < parts.length) {
          setUrlParts((prev) => [...prev, parts[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setBuildingUrl(false), 500);
        }
      }, 200);

      return () => clearInterval(interval);
    } else {
      if (isCompleted) {
        setBuildingUrl(false);
        const parts = [
          "https://",
          "secure-share.app/",
          "msg#",
          "key=",
          symmetricKey,
          "&",
          "data=",
          "encrypted_data...",
        ];
        setUrlParts(parts);
      } else {
        setBuildingUrl(false);
        setUrlParts([]);
      }
    }
  }, [isActive, isCompleted, symmetricKey]);

  return (
    <div
      className={`relative bg-slate-800/50 rounded-xl p-6 border transition-all duration-500 min-h-[280px] flex flex-col ${
        isActive
          ? "border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] scale-105"
          : isCompleted
            ? "border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
            : "border-slate-700 opacity-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg transition-all ${
              isActive
                ? "bg-pink-500/20"
                : isCompleted
                  ? "bg-pink-400/20"
                  : "bg-slate-700/50"
            }`}
          >
            <Link
              className={`w-6 h-6 transition-colors ${
                isActive
                  ? "text-pink-400 animate-pulse"
                  : isCompleted
                    ? "text-pink-400"
                    : "text-slate-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Generate Shareable URL</h3>
            <p className="text-xs text-slate-400">Embed key in URL fragment</p>
          </div>
        </div>
        {!buildingUrl && urlParts.length > 0 && isCompleted && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Ready to Share</span>
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1">
        <div
          className={`rounded-lg p-4 flex-1 flex flex-col transition-all ${
            isActive || isCompleted
              ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30"
              : "bg-slate-900/30 border border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-medium transition-colors ${
                isActive || isCompleted ? "text-pink-400" : "text-slate-500"
              }`}
            >
              Shareable Link
            </span>
            {isCompleted && (
              <button className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="font-mono text-xs break-all flex-1 flex items-center">
            <span
              className={`transition-colors ${
                isActive || isCompleted ? "text-pink-300" : "text-slate-600"
              }`}
            >
              {Array.isArray(urlParts) &&
                urlParts.map((part, index) => {
                  let color =
                    isActive || isCompleted
                      ? "text-pink-300"
                      : "text-slate-600";
                  if (
                    (isActive || isCompleted) &&
                    part &&
                    part.includes("key=")
                  )
                    color = "text-cyan-400";
                  if ((isActive || isCompleted) && part === symmetricKey)
                    color = "text-cyan-300 font-bold";
                  if (
                    (isActive || isCompleted) &&
                    part &&
                    part.includes("data=")
                  )
                    color = "text-purple-400";
                  if ((isActive || isCompleted) && part === "encrypted_data...")
                    color = "text-purple-300";

                  return (
                    <span key={index} className={color}>
                      {part}
                      {buildingUrl && index === urlParts.length - 1 && (
                        <span className="animate-pulse">|</span>
                      )}
                    </span>
                  );
                })}
              {(!Array.isArray(urlParts) || urlParts.length === 0) && (
                <span className="text-slate-500">Building URL...</span>
              )}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-2">URL Anatomy:</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Base URL:</span>
              <span
                className={`text-xs ${
                  isActive || isCompleted ? "text-pink-400" : "text-slate-600"
                }`}
              >
                secure-share.app
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Key Parameter:</span>
              <span
                className={`text-xs ${
                  isActive || isCompleted ? "text-cyan-400" : "text-slate-600"
                }`}
              >
                #key=
                {symmetricKey
                  ? symmetricKey.substring(0, 12) + "..."
                  : "loading..."}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Encrypted Data:</span>
              <span
                className={`text-xs ${
                  isActive || isCompleted ? "text-purple-400" : "text-slate-600"
                }`}
              >
                Base64 encoded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Decryption Step 3: Receive URL - Fixed height
const DecryptionStep3 = ({ isActive, isCompleted, generatedUrl }) => {
  const [receiving, setReceiving] = useState(false);

  useEffect(() => {
    if (isActive) {
      setReceiving(true);
      const timer = setTimeout(() => setReceiving(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setReceiving(false);
    }
  }, [isActive]);

  return (
    <div
      className={`relative bg-slate-800/50 rounded-xl p-6 border transition-all duration-500 min-h-[240px] flex flex-col ${
        isActive
          ? "border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] scale-105"
          : isCompleted
            ? "border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
            : "border-slate-700 opacity-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg transition-all ${
              isActive
                ? "bg-pink-500/20"
                : isCompleted
                  ? "bg-pink-400/20"
                  : "bg-slate-700/50"
            }`}
          >
            <Download
              className={`w-6 h-6 transition-colors ${
                isActive
                  ? "text-pink-400"
                  : isCompleted
                    ? "text-pink-400"
                    : "text-slate-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Receive Shared URL</h3>
            <p className="text-xs text-slate-400">Click or access link</p>
          </div>
        </div>
        {isActive && receiving && (
          <div className="animate-pulse text-xs text-pink-400">
            Receiving...
          </div>
        )}
        {isCompleted && !isActive && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Received</span>
          </div>
        )}
      </div>

      <div
        className={`rounded-lg p-4 transition-all duration-300 flex-1 flex flex-col ${
          isActive
            ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 scale-105"
            : isCompleted
              ? "bg-gradient-to-r from-pink-500/5 to-purple-500/5 border border-pink-400/20"
              : "bg-slate-900/30 border border-slate-700"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-medium transition-colors ${
              isActive || isCompleted ? "text-pink-400" : "text-slate-500"
            }`}
          >
            Incoming Link
          </span>
          {isActive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
          )}
          {isCompleted && !isActive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-emerald-400">Ready</span>
            </div>
          )}
        </div>
        <div
          className={`font-mono text-xs break-all transition-colors flex-1 flex items-center ${
            isActive || isCompleted ? "text-pink-300" : "text-slate-600"
          }`}
        >
          {generatedUrl}
        </div>
      </div>

      {(isActive || isCompleted) && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">URL Analysis:</span>
            <span className="text-emerald-400">Valid ✓</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Protocol:</span>
            <span className="text-pink-400">HTTPS ✓</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Decryption Step 2: Extract Key from URL - Fixed height
const DecryptionStep2 = ({ isActive, isCompleted, symmetricKey }) => {
  const [extracting, setExtracting] = useState(false);
  const [extractedKey, setExtractedKey] = useState("");

  useEffect(() => {
    let interval;
    let timeout;

    if (isActive && symmetricKey) {
      setExtracting(true);
      setExtractedKey("");

      timeout = setTimeout(() => {
        let i = 0;
        interval = setInterval(() => {
          if (i < symmetricKey.length) {
            const nextChar = symmetricKey[i];
            setExtractedKey((prev) => (nextChar ? prev + nextChar : prev));
            i++;
          } else {
            clearInterval(interval);
            setTimeout(() => setExtracting(false), 300);
          }
        }, 50);
      }, 500);
    } else {
      if (isCompleted) {
        setExtracting(false);
        setExtractedKey(symmetricKey || "");
      } else {
        setExtracting(false);
        setExtractedKey("");
      }
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isActive, isCompleted, symmetricKey]);

  return (
    <div
      className={`relative bg-slate-800/50 rounded-xl p-6 border transition-all duration-500 min-h-[280px] flex flex-col ${
        isActive
          ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-105"
          : isCompleted
            ? "border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            : "border-slate-700 opacity-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg transition-all ${
              isActive
                ? "bg-purple-500/20"
                : isCompleted
                  ? "bg-purple-400/20"
                  : "bg-slate-700/50"
            }`}
          >
            <Key
              className={`w-6 h-6 transition-colors ${
                isActive
                  ? "text-purple-400 animate-pulse"
                  : isCompleted
                    ? "text-purple-400"
                    : "text-slate-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Extract Key from URL</h3>
            <p className="text-xs text-slate-400">Parse URL fragment</p>
          </div>
        </div>
        {!extracting && extractedKey && isCompleted && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Extracted</span>
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">Extraction Process:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Parse URL:</span>
              <span className="text-pink-400">Done ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Find key parameter:</span>
              <span
                className={
                  isActive || isCompleted ? "text-purple-400" : "text-slate-500"
                }
              >
                {isActive ? "Searching..." : isCompleted ? "Found ✓" : "Ready"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Extract key value:</span>
              <span
                className={
                  extractedKey && (isActive || isCompleted)
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              >
                {extractedKey && (isActive || isCompleted)
                  ? "Found ✓"
                  : "Pending"}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 transition-all duration-300 flex-1 flex flex-col ${
            isActive
              ? "bg-black/40 border-2 border-purple-500/50"
              : isCompleted
                ? "bg-black/40 border border-purple-400/30"
                : "bg-black/20 border border-slate-700"
          }`}
        >
          <div className="text-xs text-slate-400 mb-2">Extracted Key:</div>
          <div className="font-mono text-sm flex-1 flex items-center">
            <span
              className={`transition-colors ${
                extracting
                  ? "text-purple-400/70"
                  : isActive || isCompleted
                    ? "text-purple-400"
                    : "text-slate-600"
              }`}
            >
              {extracting
                ? "Extracting"
                : isCompleted
                  ? extractedKey || symmetricKey || "Key extracted"
                  : "Waiting for URL..."}
              {extracting && <span className="animate-pulse ml-1">|</span>}
            </span>
          </div>
        </div>

        {extractedKey && !extracting && isCompleted && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs">
              <Shield className="w-4 h-4" />
              <span>Key successfully extracted from URL fragment!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Decryption Step 1: Decrypt Message - Fixed height
const DecryptionStep1 = ({
  isActive,
  isCompleted,
  symmetricKey,
  originalMessage,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setDisplayText("");
      setProgress(0);

      // Progress Bar Animation
      const pInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 5 : 100));
      }, 50);

      // Typing Animation
      let i = 0;
      const tInterval = setInterval(() => {
        if (i < originalMessage.length) {
          setDisplayText(originalMessage.substring(0, i + 1));
          i++;
        } else {
          clearInterval(tInterval);
        }
      }, 40);

      return () => {
        clearInterval(pInterval);
        clearInterval(tInterval);
      };
    } else {
      if (isCompleted) {
        setDisplayText(originalMessage);
        setProgress(100);
      } else {
        setDisplayText("");
        setProgress(0);
      }
    }
  }, [isActive, isCompleted, originalMessage]);

  return (
    <div
      className={`relative bg-slate-800/40 rounded-xl p-5 border transition-all duration-500 h-[220px] flex flex-col ${
        isActive
          ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]"
          : isCompleted
            ? "border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
            : "border-slate-700/50 opacity-60"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${
            isActive
              ? "bg-emerald-500/20"
              : isCompleted
                ? "bg-emerald-400/20"
                : "bg-slate-700/30"
          }`}
        >
          <Shield
            className={`w-5 h-5 ${
              isActive
                ? "text-emerald-400"
                : isCompleted
                  ? "text-emerald-400"
                  : "text-slate-500"
            }`}
          />
        </div>
        <h3
          className={`font-medium text-sm transition-colors ${
            isActive || isCompleted ? "text-slate-200" : "text-slate-500"
          }`}
        >
          Final Decryption
        </h3>
      </div>

      <div className="flex-1 space-y-3">
        <div
          className={`p-3 rounded border min-h-[80px] transition-all ${
            isActive || isCompleted
              ? "bg-black/60 border-emerald-900/30"
              : "bg-black/30 border-slate-700/30"
          }`}
        >
          <div
            className={`text-[10px] uppercase mb-1 font-bold transition-colors ${
              isActive || isCompleted
                ? "text-emerald-500/50"
                : "text-slate-500/50"
            }`}
          >
            Decrypted Content:
          </div>
          <p
            className={`text-sm font-mono transition-colors ${
              isActive || isCompleted ? "text-emerald-100" : "text-slate-500"
            }`}
          >
            {displayText}
            {isActive && progress < 100 && (
              <span className="animate-pulse">_</span>
            )}
          </p>
        </div>

        <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              isActive || isCompleted ? "bg-emerald-500" : "bg-slate-600"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isCompleted && !isActive && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-emerald-400 text-xs">
          <CheckCircle className="w-3 h-3" />
          <span>Decrypted</span>
        </div>
      )}
    </div>
  );
};

export default EncryptionFlowAnimation;
