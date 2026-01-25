import { useState } from "react";
import {
  Key,
  Lock,
  Shield,
  CheckCircle,
  Upload,
  Download,
  Copy,
  AlertCircle,
  Zap,
  Loader,
} from "lucide-react";

// Add keyframe animations
const styles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes shimmer {
    0%, 100% { background-position: -1000px 0; }
    50% { background-position: 1000px 0; }
  }
`;

// Inject styles into document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const DualPaneEncryption = () => {
  // ========== SENDER STATE ==========
  const [senderKey, setSenderKey] = useState("");
  const [messageToEncrypt, setMessageToEncrypt] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [senderStatus, setSenderStatus] = useState("Ready");
  const [loadingKey, setLoadingKey] = useState(false);
  const [loadingEncrypt, setLoadingEncrypt] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // ========== RECEIVER STATE ==========
  const [manualKey, setManualKey] = useState("");
  const [manualEncryptedData, setManualEncryptedData] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [receiverStatus, setReceiverStatus] = useState("Ready");
  const [manualDecryptError, setManualDecryptError] = useState("");
  const [loadingManualDecrypt, setLoadingManualDecrypt] = useState(false);

  // ========== HANDLERS: SENDER SIDE ==========
  const generateSymmetricKey = async () => {
    try {
      setLoadingKey(true);
      setSenderStatus("Generating...");

      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate a 256-bit AES-GCM key
      const cryptoKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, // extractable
        ["encrypt", "decrypt"],
      );

      // Export the key to raw format and convert to Base64
      const rawKey = await window.crypto.subtle.exportKey("raw", cryptoKey);
      const keyString = btoa(String.fromCharCode(...new Uint8Array(rawKey)));

      setSenderKey(keyString);
      setSenderStatus("Ready");
      setEncryptedData("");
      setLoadingKey(false);
    } catch (error) {
      setSenderStatus("Error");
      setLoadingKey(false);
      console.error("Key generation failed:", error);
    }
  };

  const encryptMessage = async () => {
    if (!senderKey || !messageToEncrypt) {
      alert("Please generate a key first and enter a message");
      return;
    }

    try {
      setLoadingEncrypt(true);
      setSenderStatus("Encrypting...");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Import the key
      const binaryString = atob(senderKey);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        bytes,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      );

      // Generate a random 12-byte IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Encrypt the message
      const encodedMessage = new TextEncoder().encode(messageToEncrypt);
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        cryptoKey,
        encodedMessage,
      );

      // Combine IV + encryptedData and encode to Base64
      const combinedBuffer = new Uint8Array(
        iv.length + encryptedBuffer.byteLength,
      );
      combinedBuffer.set(iv);
      combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length);

      const encryptedBase64 = btoa(String.fromCharCode(...combinedBuffer));
      setEncryptedData(encryptedBase64);
      setSenderStatus("Encrypted");
      setLoadingEncrypt(false);
    } catch (error) {
      setSenderStatus("Error");
      setLoadingEncrypt(false);
      console.error("Encryption failed:", error);
    }
  };

  // ========== HANDLERS: RECEIVER SIDE ==========
  const decryptMessageManual = async () => {
    if (!manualKey) {
      setManualDecryptError("Please enter your key");
      return;
    }

    if (!manualEncryptedData) {
      setManualDecryptError("Please enter encrypted data");
      return;
    }

    try {
      setLoadingManualDecrypt(true);
      setReceiverStatus("Decrypting...");
      setManualDecryptError("");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Import the key
      const binaryString = atob(manualKey);
      const keyBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        keyBytes[i] = binaryString.charCodeAt(i);
      }

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"],
      );

      // Decode the encrypted data
      const encryptedBinary = atob(manualEncryptedData);
      const encryptedBytes = new Uint8Array(encryptedBinary.length);
      for (let i = 0; i < encryptedBinary.length; i++) {
        encryptedBytes[i] = encryptedBinary.charCodeAt(i);
      }

      // Extract IV (first 12 bytes) and encrypted data
      const iv = encryptedBytes.slice(0, 12);
      const encryptedContent = encryptedBytes.slice(12);

      // Decrypt
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        cryptoKey,
        encryptedContent,
      );

      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      setDecryptedMessage(decryptedText);
      setReceiverStatus("Decrypted");
      setLoadingManualDecrypt(false);
    } catch (error) {
      setManualDecryptError("Decryption failed: " + error.message);
      setDecryptedMessage("");
      setReceiverStatus("Error");
      setLoadingManualDecrypt(false);
      console.error("Decryption failed:", error);
    }
  };

  // ========== COPY TO CLIPBOARD ==========
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);

      // Clear the "Copied!" feedback after 2 seconds
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-teal-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Secure Message Encryption
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Share encrypted messages with URL-embedded keys. No server storage
            required.
          </p>
        </div>

        {/* Main Dual Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ========== SENDER SIDE ========== */}
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-teal-400">
                <Upload className="w-6 h-6" />
                Sender Side
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Create and share an encrypted message
              </p>
            </div>

            {/* Module 1: Generate Key */}
            <div className="bg-slate-900/60 border border-teal-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/20 rounded-lg">
                  <Key className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Generate Symmetric Key
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Create a unique 256-bit AES-GCM encryption key
              </p>

              <button
                onClick={generateSymmetricKey}
                disabled={loadingKey}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingKey && <Loader className="w-4 h-4 animate-spin" />}
                {loadingKey ? "Generating Key..." : "Generate Key"}
              </button>

              {senderKey && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg border border-teal-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">
                      Generated Key (Base64):
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-xs text-teal-300 break-all bg-black/60 p-3 rounded border border-teal-500/20">
                    {senderKey}
                  </div>
                  <button
                    onClick={() => copyToClipboard(senderKey, "key")}
                    className="mt-2 flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition-colors hover:bg-teal-500/10 px-3 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4 hover:scale-110 transition-transform" />
                    {copiedField === "key" ? "Copied!" : "Copy Key"}
                  </button>
                </div>
              )}
            </div>

            {/* Module 2: Encrypt Message */}
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Encrypt Message
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Enter your secret message and encrypt it with the generated key
              </p>

              <textarea
                value={messageToEncrypt}
                onChange={(e) => setMessageToEncrypt(e.target.value)}
                placeholder="Type your secret message here..."
                className="w-full h-32 px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:border-purple-500/50 focus:outline-none transition-colors resize-none"
              />

              <button
                onClick={encryptMessage}
                disabled={!senderKey || !messageToEncrypt || loadingEncrypt}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingEncrypt && <Loader className="w-4 h-4 animate-spin" />}
                {loadingEncrypt ? "Encrypting..." : "Encrypt Message"}
              </button>

              {encryptedData && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">
                      Encrypted (Base64):
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-xs text-purple-300 break-all bg-black/60 p-3 rounded border border-purple-500/20 max-h-24 overflow-y-auto">
                    {encryptedData}
                  </div>
                  <button
                    onClick={() => copyToClipboard(encryptedData, "encrypted")}
                    className="mt-2 flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors hover:bg-purple-500/10 px-3 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4 hover:scale-110 transition-transform" />
                    {copiedField === "encrypted"
                      ? "Copied!"
                      : "Copy Encrypted Data"}
                  </button>
                </div>
              )}
            </div>

            {/* Status Bar - Sender */}
            <div className="flex items-center gap-3 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
              <Zap className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <div>
                <p className="text-teal-400 font-semibold text-sm">
                  Status: {senderStatus}
                </p>
              </div>
            </div>
          </div>

          {/* ========== RECEIVER SIDE ========== */}
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-cyan-400">
                <Download className="w-6 h-6" />
                Receiver Side
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Decrypt a shared message
              </p>
            </div>

            {/* Manual Input Decryption */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-teal-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-teal-400/60 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-teal-500/20 rounded-lg">
                    <Key className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Paste Encryption Key
                  </h3>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                  Paste the Base64-encoded encryption key
                </p>

                <textarea
                  value={manualKey}
                  onChange={(e) => {
                    setManualKey(e.target.value);
                    setManualDecryptError("");
                  }}
                  placeholder="Paste key (Base64 format) here..."
                  className="w-full h-16 px-4 py-3 bg-black/40 border border-teal-500/20 rounded-lg text-white placeholder-slate-500 focus:border-teal-500/50 focus:outline-none transition-colors resize-none font-mono text-xs"
                />
              </div>

              {/* Encrypted Data Input */}
              <div className="bg-slate-900/60 border border-pink-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-pink-400/60 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-500/20 rounded-lg">
                    <Lock className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Paste Encrypted Message
                  </h3>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                  Paste the encrypted message in Base64 format
                </p>

                <textarea
                  value={manualEncryptedData}
                  onChange={(e) => {
                    setManualEncryptedData(e.target.value);
                    setManualDecryptError("");
                  }}
                  placeholder="Paste encrypted data (Base64 format) here..."
                  className={`w-full h-20 px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors resize-none font-mono text-xs ${
                    manualEncryptedData && manualDecryptError
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-pink-500/20 focus:border-pink-500/50"
                  }`}
                />

                {manualEncryptedData && !manualDecryptError && (
                  <div className="mt-3 p-3 bg-pink-500/10 rounded border border-pink-500/20">
                    <p className="text-pink-300 text-xs">✓ Ready to decrypt</p>
                  </div>
                )}
              </div>

              {/* Decrypt Button */}
              <button
                onClick={decryptMessageManual}
                disabled={
                  !manualKey || !manualEncryptedData || loadingManualDecrypt
                }
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingManualDecrypt && (
                  <Loader className="w-4 h-4 animate-spin" />
                )}
                {loadingManualDecrypt ? "Decrypting..." : "Decrypt Message"}
              </button>

              {manualDecryptError && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{manualDecryptError}</p>
                </div>
              )}
            </div>

            {/* Decrypted Message Display */}
            {decryptedMessage && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Decrypted Message
                    </h3>
                  </div>

                  <div className="bg-black/60 p-4 rounded border border-purple-500/20 min-h-24 mb-3">
                    <p className="text-white text-sm whitespace-pre-wrap break-words">
                      {decryptedMessage}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(decryptedMessage, "decrypted")
                    }
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors hover:bg-purple-500/10 px-3 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4 hover:scale-110 transition-transform" />
                    {copiedField === "decrypted" ? "Copied!" : "Copy Message"}
                  </button>
                </div>

                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-300 text-sm font-semibold">
                    Message successfully decrypted!
                  </p>
                </div>
              </div>
            )}

            {/* Status Bar - Receiver */}
            <div className="flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-cyan-400 font-semibold text-sm">
                  Status: {receiverStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="p-4 bg-slate-900/40 border border-slate-700/50 rounded-lg">
            <Lock className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold text-sm">
              256-bit AES-GCM
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Military-grade encryption
            </p>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/50 rounded-lg">
            <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold text-sm">Client-Side</p>
            <p className="text-slate-500 text-xs mt-1">All processing local</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualPaneEncryption;
