import React, { useState } from "react";
import {
  Key,
  Lock,
  Link,
  Shield,
  CheckCircle,
  Upload,
  Download,
  Copy,
  AlertCircle,
  Zap,
  Loader,
} from "lucide-react";

const DualPaneEncryption = () => {
  // ========== SENDER STATE ==========
  const [senderKey, setSenderKey] = useState("");
  const [messageToEncrypt, setMessageToEncrypt] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [shareableUrl, setShareableUrl] = useState("");
  const [senderStatus, setSenderStatus] = useState("Ready");
  const [loadingKey, setLoadingKey] = useState(false);
  const [loadingEncrypt, setLoadingEncrypt] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // ========== RECEIVER STATE ==========
  const [pastedUrl, setPastedUrl] = useState("");
  const [manualEncryptedData, setManualEncryptedData] = useState("");
  const [receiverKey, setReceiverKey] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [receiverStatus, setReceiverStatus] = useState("Ready");
  const [extractKeyError, setExtractKeyError] = useState("");
  const [decryptError, setDecryptError] = useState("");
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingDecrypt, setLoadingDecrypt] = useState(false);

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
      setShareableUrl("");
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

  const generateShareableUrl = async () => {
    if (!senderKey || !encryptedData) {
      alert("Please encrypt a message first");
      return;
    }

    try {
      setLoadingUrl(true);
      setSenderStatus("Creating URL...");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      const url = `${window.location.origin}#key=${encodeURIComponent(senderKey)}&data=${encodeURIComponent(encryptedData)}`;
      setShareableUrl(url);
      setSenderStatus("URL Generated");
      setLoadingUrl(false);
    } catch (error) {
      setSenderStatus("Error");
      setLoadingUrl(false);
      console.error("URL generation failed:", error);
    }
  };

  // ========== HANDLERS: RECEIVER SIDE ==========
  const extractKeyFromUrl = async () => {
    if (!pastedUrl) {
      setExtractKeyError("Please paste a URL");
      return;
    }

    try {
      setLoadingExtract(true);
      setReceiverStatus("Extracting...");
      setExtractKeyError("");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Parse the URL to extract key and data
      const urlObj = new URL(pastedUrl, window.location.origin);
      const keyParam = urlObj.hash.split("key=")[1]?.split("&")[0];
      const dataParam = urlObj.hash.split("data=")[1];

      if (!keyParam || !dataParam) {
        setExtractKeyError("Invalid URL format. Please check the link.");
        setReceiverStatus("Error");
        setLoadingExtract(false);
        return;
      }

      const decodedKey = decodeURIComponent(keyParam);
      setReceiverKey(decodedKey);
      setReceiverStatus("Extracted");
      setLoadingExtract(false);
    } catch (error) {
      setExtractKeyError("Failed to parse URL: " + error.message);
      setReceiverStatus("Error");
      setLoadingExtract(false);
      console.error("URL parsing failed:", error);
    }
  };

  const decryptMessage = async () => {
    if (!receiverKey) {
      setDecryptError("Please extract or enter a key first");
      return;
    }

    // Use manually entered data if available, otherwise extract from URL
    const dataSource = manualEncryptedData || pastedUrl;

    if (!dataSource) {
      setDecryptError(
        "Please provide either an encrypted message or a shared URL",
      );
      return;
    }

    try {
      setLoadingDecrypt(true);
      setReceiverStatus("Decrypting...");
      setDecryptError("");

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 700));

      let encryptedBase64 = manualEncryptedData;

      // If no manual data, extract from URL
      if (!manualEncryptedData && pastedUrl) {
        const urlObj = new URL(pastedUrl, window.location.origin);
        const dataParam = urlObj.hash.split("data=")[1];

        if (!dataParam) {
          setDecryptError("Encrypted data not found in URL");
          setReceiverStatus("Error");
          setLoadingDecrypt(false);
          return;
        }

        encryptedBase64 = decodeURIComponent(dataParam);
      }

      // Import the key
      const binaryString = atob(receiverKey);
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
      const encryptedBinary = atob(encryptedBase64);
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
      setLoadingDecrypt(false);
    } catch (error) {
      setDecryptError("Decryption failed: " + error.message);
      setDecryptedMessage("");
      setReceiverStatus("Error");
      setLoadingDecrypt(false);
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
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
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

            {/* Module 3: Generate Shareable URL */}
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Link className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Generate Shareable URL
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Combine the key and encrypted data into a shareable link using
                URL fragments (#)
              </p>

              <button
                onClick={generateShareableUrl}
                disabled={!senderKey || !encryptedData || loadingUrl}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingUrl && <Loader className="w-4 h-4 animate-spin" />}
                {loadingUrl ? "Generating URL..." : "Generate Shareable URL"}
              </button>

              {shareableUrl && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">
                      Shareable URL:
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-xs text-cyan-300 break-all bg-black/60 p-3 rounded border border-cyan-500/20">
                    {shareableUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(shareableUrl, "url")}
                    className="mt-2 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors hover:bg-cyan-500/10 px-3 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4 hover:scale-110 transition-transform" />
                    {copiedField === "url" ? "Copied!" : "Copy URL"}
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

            {/* Module 4: Receive Shared URL */}
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-400/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Download className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Receive Shared URL
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Paste the shared link here to extract the key and encrypted data
              </p>

              <textarea
                value={pastedUrl}
                onChange={(e) => {
                  setPastedUrl(e.target.value);
                  setExtractKeyError("");
                }}
                placeholder="Paste the shared URL here..."
                className="w-full h-24 px-4 py-3 bg-black/40 border border-cyan-500/20 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors resize-none font-mono text-xs"
              />

              <button
                onClick={extractKeyFromUrl}
                disabled={!pastedUrl || loadingExtract}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingExtract && <Loader className="w-4 h-4 animate-spin" />}
                {loadingExtract ? "Extracting..." : "Extract Key from URL"}
              </button>

              {receiverKey && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">
                      Extracted Key:
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-xs text-cyan-300 break-all bg-black/60 p-3 rounded border border-cyan-500/20">
                    {receiverKey}
                  </div>
                </div>
              )}

              {extractKeyError && (
                <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{extractKeyError}</p>
                </div>
              )}
            </div>

            {/* Module 4.5: Manual Encrypted Data Input */}
            <div className="bg-slate-900/60 border border-pink-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-pink-400/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Or Enter Encrypted Data Directly
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Paste encrypted message directly (instead of using a shared URL)
              </p>

              <textarea
                value={manualEncryptedData}
                onChange={(e) => {
                  setManualEncryptedData(e.target.value);
                  setDecryptError("");
                }}
                placeholder="Paste encrypted data (Base64 format) here..."
                className={`w-full h-20 px-4 py-3 bg-black/40 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors resize-none font-mono text-xs ${
                  manualEncryptedData && decryptError
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-pink-500/20 focus:border-pink-500/50"
                }`}
              />

              {manualEncryptedData && !decryptError && (
                <div className="mt-3 p-3 bg-pink-500/10 rounded border border-pink-500/20">
                  <p className="text-pink-300 text-xs">
                    ✓ Ready to decrypt with your key
                  </p>
                </div>
              )}

              {manualEncryptedData && decryptError && (
                <div className="mt-3 p-3 bg-red-500/10 rounded border border-red-500/30 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-xs">{decryptError}</p>
                </div>
              )}
            </div>

            {/* Module 5: Decrypt Message */}
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Decrypt Message
                </h3>
              </div>

              <p className="text-slate-400 text-sm mb-4">
                Use the extracted key to decrypt the original message
              </p>

              <button
                onClick={decryptMessage}
                disabled={
                  !receiverKey ||
                  (!pastedUrl && !manualEncryptedData) ||
                  loadingDecrypt
                }
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
              >
                {loadingDecrypt && <Loader className="w-4 h-4 animate-spin" />}
                {loadingDecrypt ? "Decrypting..." : "Decrypt Message"}
              </button>

              {decryptedMessage && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">
                      Decrypted Content:
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-black/60 p-4 rounded border border-purple-500/20 min-h-24">
                    <p className="text-white text-sm whitespace-pre-wrap break-words">
                      {decryptedMessage}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(decryptedMessage, "decrypted")
                    }
                    className="mt-2 flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors hover:bg-purple-500/10 px-3 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4 hover:scale-110 transition-transform" />
                    {copiedField === "decrypted" ? "Copied!" : "Copy Message"}
                  </button>
                </div>
              )}

              {decryptedMessage && (
                <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-300 text-sm font-semibold">
                    Message successfully decrypted!
                  </p>
                </div>
              )}
            </div>

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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
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
            <Link className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold text-sm">
              URL Fragment Only
            </p>
            <p className="text-slate-500 text-xs mt-1">Never sent to server</p>
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
