import { useState } from "react";
import { AccordionSection } from "./AccordionSection";

export const RightPanel = ({
  serverRecord,
  onClear,
  copiedField,
  copyToClipboard,
}) => {
  const isData = localStorage.getItem("active-user");
  const [openSection, setOpenSection] = useState("loginHash");
  const handleSectionToggle = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const prettyBase64Preview = (str) => {
    if (!str) return "—";
    return `${str.substring(0, 8)}...${str.substring(str.length - 8)}`;
  };

  const formatPreview = (value, type = "hash") => {
    if (!value) return "—";
    switch (type) {
      case "hash":
        return prettyBase64Preview(value);
      case "key":
        return "PGP Key";
      case "encrypted":
        return "AES-256-GCM";
      case "message":
        return "Encrypted";
      default:
        return "—";
    }
  };



  const CopyButton = ({ text, fieldName }) => (
    <button
      onClick={() => copyToClipboard(text, fieldName)}
      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors font-medium"
      disabled={!text}
    >
      {copiedField === fieldName ? "Copied!" : "Copy"}
    </button>
  );

  return (
    <div className="w-[35%] bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Server Storage</h2>
        <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-full">
          {serverRecord ? "Stored" : "Empty"}
        </span>
      </div>

      <div className="space-y-2">
        <AccordionSection
          title={
            <div className="flex items-center gap-2">
              <span>Login Hash</span>
              {isData && (
                <span className="flex items-center gap-1 text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          }
          preview={formatPreview(serverRecord?.loginHash)}
          isOpen={openSection === "loginHash"}
          onToggle={() => handleSectionToggle("loginHash")}
        >
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-gray-600 font-medium">
                Derived from seed phrase (bcrypt)
              </div>
              <CopyButton
                text={serverRecord?.loginHash}
                fieldName="loginHash"
              />
            </div>
            <code className="text-xs break-all font-mono block bg-white p-2 rounded border">
              {serverRecord?.loginHash || "No data available"}
            </code>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Length: {serverRecord?.loginHash?.length || 0} chars</span>
              <span>Hash: bcrypt</span>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Public Key"
          preview={formatPreview(serverRecord?.publicKey, "key")}
          isOpen={openSection === "publicKey"}
          onToggle={() => handleSectionToggle("publicKey")}
        >
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-300">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-blue-700 font-medium">
                PGP Public Key (ECC curve25519)
              </div>
              <CopyButton
                text={serverRecord?.publicKey}
                fieldName="publicKey"
              />
            </div>
            <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-auto bg-white p-2 rounded border font-mono">
              {serverRecord?.publicKey || "No public key generated"}
            </pre>
            <div className="flex justify-between items-center mt-2 text-xs text-blue-600">
              <span>Used for encryption</span>
              <span>ECC curve25519</span>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Encrypted Private Key"
          preview={formatPreview(
            serverRecord?.encryptedPrivateKey,
            "encrypted"
          )}
          isOpen={openSection === "privateKey"}
          onToggle={() => handleSectionToggle("privateKey")}
        >
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-300">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-purple-700 font-medium">
                  Encrypted Private Key (AES-256-GCM)
                </div>
                <CopyButton
                  text={serverRecord?.encryptedPrivateKey}
                  fieldName="encryptedPrivateKey"
                />
              </div>
              <code className="text-xs break-all max-h-40 overflow-auto font-mono block bg-white p-2 rounded border">
                {serverRecord?.encryptedPrivateKey ||
                  "No encrypted private key"}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-purple-600">
                    Initialization Vector
                  </div>
                  <CopyButton
                    text={serverRecord?.encryptedPrivateKeyIV}
                    fieldName="encryptedPrivateKeyIV"
                  />
                </div>
                <code className="text-xs font-mono block">
                  {serverRecord?.encryptedPrivateKeyIV
                    ? prettyBase64Preview(serverRecord.encryptedPrivateKeyIV)
                    : "—"}
                </code>
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Algorithm</div>
                <div className="text-xs font-medium">AES-256-GCM</div>
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="Encrypted Message"
          preview={formatPreview(serverRecord?.encryptedUserData, "message")}
          isOpen={openSection === "message"}
          onToggle={() => handleSectionToggle("message")}
        >
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-300">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-orange-700 font-medium">
                PGP Encrypted User Data
              </div>
              <CopyButton
                text={serverRecord?.encryptedUserData}
                fieldName="encryptedUserData"
              />
            </div>
            <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-auto bg-white p-2 rounded border font-mono">
              {serverRecord?.encryptedUserData || "No encrypted message stored"}
            </pre>
            <div className="flex justify-between items-center mt-2 text-xs text-orange-600">
              <span>End-to-end encrypted</span>
              <span>PGP Standard</span>
            </div>
          </div>
        </AccordionSection>

        {/* Technical Details Section */}
        <AccordionSection
          title="Technical Details"
          preview="Crypto Info"
          isOpen={openSection === "technical"}
          onToggle={() => handleSectionToggle("technical")}
        >
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 font-medium">Key Algorithm</div>
                  <div className="text-gray-800">ECC curve25519</div>
                </div>
                <div>
                  <div className="text-gray-600 font-medium">Encryption</div>
                  <div className="text-gray-800">AES-256-GCM</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600 font-medium">
                    Key Derivation
                  </div>
                  <div className="text-gray-800">PBKDF2-SHA256</div>
                </div>
                <div>
                  <div className="text-gray-600 font-medium">Hashing</div>
                  <div className="text-gray-800">bcrypt-12</div>
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
          {isData && (
            <button
              className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-medium text-sm transition-all hover:bg-red-200 hover:shadow-sm"
              onClick={onClear}
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
