import React, { useState, useEffect } from 'react';
import {
    generateSeedPhrase,
    performProductionSignup,
    encryptAndStoreMessage,
    decryptMessage,
    encryptPrivateKey,
    getStoredEncryptionKey,
    decryptPrivateKey,
    performLogin,
} from '../utils/cryptoOperations';
import { StepProgress } from './ActivityLog';
import { RightPanel } from './RightPanel';

// Define step structure
const STEP_STRUCTURE = {
    SIGNUP: {
        id: 'step1',
        title: 'Signup Process',
        description: 'Creating your secure account with encrypted keys',
        status: 'pending',
        substeps: [
            'Seeds never leaves your browser.',
            'Ready for cryptographic operations',
            'Deriving cryptographic keys(Login Hash + Encryption Key) from seeds',
            'Generating PGP key pair',
            'Encrypting private key using AES-256-GCM with derived (Encryption Key)',
            'Storing encrypted data on server'
        ]
    },
    ENCRYPT_MESSAGE: {
        id: 'step2',
        title: 'Encrypt Message',
        description: 'Encrypting your message using public key cryptography',
        status: 'pending',
        substeps: [
            'Using stored public key for encryption',
            'Creating PGP encrypted message',
            'Storing encrypted message on server'
        ]
    },
    DECRYPT_MESSAGE: {
        id: 'step3',
        title: 'Decrypt Message',
        description: 'Decrypting message using your seed-derived keys',
        status: 'pending',
        substeps: [
            'Deriving keys from seed phrase',
            'Decrypting private key',
            'PGP decrypting the message',
            'Displaying original content'
        ]
    }
};

export default function DemoFlow() {
    const [activeTab, setActiveTab] = useState('signup');
    const [seed, setSeed] = useState('');
    const [step, setStep] = useState('idle');
    const [decryptResult, setDecryptResult] = useState('');
    const [copiedField, setCopiedField] = useState(null);
    const [serverRecord, setServerRecord] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [decryptedMessage, setDecryptedMessage] = useState(null);
    const [customEncryptedMessage, setCustomEncryptedMessage] = useState('');
    const [loginSeedInput, setLoginSeedInput] = useState('');
    const [loginStatus, setLoginStatus] = useState(''); // 'logging-in', 'success', 'error'
    const [loginResult, setLoginResult] = useState(null);

    const handleLogin = async () => {
        if (!loginSeedInput.trim()) {
            setLoginResult({
                success: false,
                message: 'Please enter your seed phrase'
            });
            return;
        }

        setLoginStatus('logging-in');
        setLoginResult(null);

        try {
            const isValid = await performLogin(loginSeedInput);
            localStorage.setItem('active-user', JSON.stringify(isValid.user));
            setServerRecord(isValid.user)
            if (isValid) {
                setLoginStatus('success');
                setLoginResult({
                    success: true,
                    message: 'Login successful!',
                    details: 'Your seed phrase was used to derive keys and verify your identity without exposing the seed to the server.'
                });
            } else {
                setLoginStatus('error');
                setLoginResult({
                    success: false,
                    message: 'Invalid seed phrase'
                });
            }
        } catch (error) {
            setLoginStatus('error');
            setLoginResult({
                success: false,
                message: 'Login failed: ' + error.message
            });
        }
    };

    const [steps, setSteps] = useState({
        step1: { ...STEP_STRUCTURE.SIGNUP, status: 'pending' },
        step2: { ...STEP_STRUCTURE.ENCRYPT_MESSAGE, status: 'pending' },
        step3: { ...STEP_STRUCTURE.DECRYPT_MESSAGE, status: 'pending' }
    });

    const updateStep = (stepId, updates) => {
        setSteps(prev => ({
            ...prev,
            [stepId]: { ...prev[stepId], ...updates }
        }));
    };

    const completeSubstep = (stepId, substepIndex) => {
        setSteps(prev => {
            const step = { ...prev[stepId] };
            if (!step.completedSubsteps) step.completedSubsteps = [];
            if (!step.completedSubsteps.includes(substepIndex)) {
                step.completedSubsteps = [...step.completedSubsteps, substepIndex];
            }
            return { ...prev, [stepId]: step };
        });
    };

    useEffect(() => {
        try {
            const usersData = localStorage.getItem('active-user');

            if (usersData) {
                const parsedData = JSON.parse(usersData);
                setServerRecord(parsedData);
            } else {
                setServerRecord(null);
            }
        } catch (error) {
            localStorage.removeItem('active-user');
            setServerRecord(null);
        }
    }, []);


    const copyToClipboard = async (text, fieldName) => {
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 800);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const completeSubstepWithDelay = async (stepId, substepIndex, delay = 1500) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        setSteps(prev => {
            const step = { ...prev[stepId] };
            if (!step.completedSubsteps) step.completedSubsteps = [];
            if (!step.completedSubsteps.includes(substepIndex)) {
                step.completedSubsteps = [...step.completedSubsteps, substepIndex];
            }
            return { ...prev, [stepId]: step };
        });
    };


    async function handleSignupAuto() {
        setStep('signup');
        resetAllSteps();
        try {
            // STEP 1: Generate Seed
            updateStep('step1', { status: 'active' });
            const newSeed = await generateSeedPhrase();
            setSeed(newSeed);
            await completeSubstepWithDelay('step1', 0, 800);
            await completeSubstepWithDelay('step1', 1, 800);

            // STEP 2: Signup Process
            await completeSubstepWithDelay('step1', 2, 1200);
            await completeSubstepWithDelay('step1', 3, 1500);
            await completeSubstepWithDelay('step1', 4, 1200);

            const results = await performProductionSignup(newSeed);
            localStorage.setItem('active-user', JSON.stringify(results.serverRecord));
            setServerRecord(results.serverRecord);

            await completeSubstepWithDelay('step1', 5, 1000);

            updateStep('step1', { status: 'completed' });
            setStep('account-created');

        } catch (err) {
            updateStep('step1', { status: 'error' });
            alert('Signup failed: ' + err.message);
            setStep('');
        }
    }

    async function handleEncryptAndStore() {
        updateStep('step2', { status: 'active' });

        try {
            await completeSubstepWithDelay('step2', 0, 800);

            const pub = serverRecord.publicKey;
            const result = await encryptAndStoreMessage(messageInput, pub, serverRecord.loginHash);
            await completeSubstepWithDelay('step2', 1, 1000);

            setServerRecord(result.storageResult.user);
            await completeSubstepWithDelay('step2', 2, 1000);
            updateStep('step2', { status: 'completed' });
            setMessageInput('');

        } catch (err) {
            console.error(err);
            updateStep('step2', { status: 'error' });
        }
    }

    async function handleDecryptCustomMessage() {
        setDecryptedMessage(null);
        updateStep('step3', { status: 'active' });

        try {
            await completeSubstepWithDelay('step3', 0, 800);

            const decrypted = await decryptMessage(serverRecord, customEncryptedMessage.trim());

            await completeSubstepWithDelay('step3', 1, 1000);
            setDecryptedMessage(decrypted);

            await completeSubstepWithDelay('step3', 2, 1000);
            updateStep('step3', { status: 'completed' });
            await completeSubstepWithDelay('step3', 3, 500);

        } catch (err) {
            console.error(err);
            updateStep('step3', { status: 'error' });
        }
    }

    async function handleDecryptPrivateKey() {
        const encryptionKey = await getStoredEncryptionKey();
        try {
            const privateKey = await decryptPrivateKey(serverRecord.encryptedPrivateKey,
                serverRecord.encryptedPrivateKeyIV,
                serverRecord.encryptedPrivateKeyTag,
                encryptionKey)
            setDecryptResult(privateKey);
        } catch (error) {
            console.error('Decryption failed:', error);
            setDecryptResult('Decryption failed. Please check your seed phrase and try again.');
        }


    }

    // Reset all steps
    const resetAllSteps = () => {
        setSteps({
            step1: { ...STEP_STRUCTURE.SIGNUP, status: 'pending' },
            step2: { ...STEP_STRUCTURE.ENCRYPT_MESSAGE, status: 'pending' },
            step3: { ...STEP_STRUCTURE.DECRYPT_MESSAGE, status: 'pending' }
        });
    };


    const handleLogout = () => {
        localStorage.removeItem("active-user");
        localStorage.removeItem("encryption-key");
        resetAllSteps();
        setStep('idel');
        setServerRecord(null);
        setDecryptResult('');
        setMessageInput('');
        setDecryptedMessage(null);
        setCustomEncryptedMessage('')
        setSeed('');
        setLoginResult(null);
        setLoginSeedInput('');
        setLoginStatus('');
    }

  const isUserRegister = localStorage.getItem("active-user");


    return (
        <div className="flex gap-4 px-6 py-8 bg-gray-50 min-h-screen w-full">
            {/* Left Panel - Actions */}
            <div className="w-[35%] bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-6">
                    Zero-Knowledge Demo
                </h1>

                {/* Toggle Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-6 relative">
                    <button
                        className={`flex-1 py-3 px-6 rounded-md font-semibold text-sm transition-all duration-300 z-10 ${activeTab === 'signup'
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Signup Flow
                    </button>
                    <button
                        className={`flex-1 py-3 px-6 rounded-md font-semibold text-sm transition-all duration-300 z-10 ${activeTab === 'encrypt'
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => setActiveTab('encrypt')}
                    >
                        Encrypt Message
                    </button>
                    <div
                        className={`absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ${activeTab === 'signup'
                            ? 'left-1 right-1/2'
                            : 'left-1/2 right-1'
                            }`}
                    />
                </div>

                {/* Signup Flow Section */}
                <div className={`transition-all duration-300 ${activeTab === 'signup' ? 'block' : 'hidden'}`}>
                    <div className="space-y-4">
                        {/* Step 1: Generate Seed */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-2">
                                Sign up for Secure Account
                            </h3>
                            <p className="text-blue-700 text-sm mb-3">
                                Create your account. Server stores only encrypted data - no access to your keys or seed.
                            </p>
                            <button
                                className="w-full mt-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={handleSignupAuto}
                                disabled={step === 'signup'}
                            >
                                {step === 'signup' ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : step === 'account-created' ? (
                                    'Recreate Account'
                                ) : (
                                    'Run Signup Flow'
                                )}
                            </button>

                            {/* Temporary Seed Display */}
                            {seed && (
                                <div className={`mt-4 p-3 bg-green-50 rounded-lg border border-green-200 ${step === 'signup' ? "animate-pulse" : ""} `}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-green-800 text-sm">Your Seed Phrase (Save This!)</h4>
                                        <button
                                            onClick={() => copyToClipboard(seed, "seeds")}
                                            className="px-2 py-1 text-xs font-[700] bg-teal-600 hover:bg-teal-700 text-white rounded"
                                        >
                                            {copiedField === "seeds" ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 mb-2">
                                        {seed.split(' ').map((w, i) => (
                                            <div key={i} className="bg-white uppercase border border-green-200 p-1 rounded text-xs text-center font-medium text-gray-700">
                                                {w}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-green-600 text-center">
                                        ⚠️ This seed never leaves your device. Save it securely for decryption!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Login Field - Shows after signup completes */}

                        <div className="space-y-4">

                            {/* Login Field */}
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <h3 className="font-semibold text-purple-800 mb-3">
                                    Login with Your Seed
                                </h3>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-purple-700">
                                            Enter Your Seed Phrase:
                                        </label>
                                        <textarea
                                            value={loginSeedInput}
                                            onChange={(e) => setLoginSeedInput(e.target.value)}
                                            placeholder="Paste your 16-word seed phrase here..."
                                            className="w-full p-3 border border-purple-300 rounded-lg text-sm resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleLogin}
                                            disabled={!loginSeedInput.trim() || loginStatus === 'logging-in'}
                                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm transition-all hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loginStatus === 'logging-in' ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Logging in...
                                                </>
                                            ) : (
                                                'Login to Account'
                                            )}
                                        </button>
                                    </div>

                                    {loginResult && (
                                        <div
                                            className={`p-3 rounded-lg text-sm border ${loginResult.success
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {loginResult.success ? '✅' : '❌'}
                                                <span className="font-medium">{loginResult.message}</span>
                                            </div>
                                            {loginResult.details && (
                                                <p className="mt-2 text-xs opacity-75">{loginResult.details}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Decryption Field */}
                            {isUserRegister && (<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="space-y-3">
                                    <button
                                        onClick={handleDecryptPrivateKey}
                                        className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold text-sm transition-all hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Decrypt Private Key
                                    </button>

                                    {decryptResult && (
                                        <div
                                            className={`relative p-3 py-4 max-h-40 overflow-auto rounded-lg text-[12px] ${decryptResult.includes('-----')
                                                ? 'text-black font-mono bg-white border border-green-200'
                                                : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}
                                        >
                                            <button
                                                onClick={() => copyToClipboard(decryptResult, "privateKey")}
                                                className="absolute top-2 right-2 px-2 py-1 text-xs font-[700] bg-gray-600 text-white rounded"
                                            >
                                                {copiedField === "privateKey" ? "Copied!" : "Copy"}
                                            </button>
                                            {decryptResult}
                                        </div>
                                    )}
                                </div>
                            </div>
                            )}

                        </div>

                    </div>
                </div>

                {/* Encrypt/Decrypt Section */}
                <div className={`transition-all duration-300 ${activeTab === 'encrypt' ? 'block' : 'hidden'
                    }`}>
                    <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h3 className="font-semibold text-orange-800 mb-2">
                                Encrypt Message
                            </h3>
                            <p className="text-orange-700 text-sm mb-3">
                                Write a message and encrypt it using your public key. Only your private key can decrypt it.
                            </p>
                            <textarea
                                rows="3"
                                placeholder="Type your secret message here..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="w-full border border-orange-300 p-3 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold text-sm transition-all hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleEncryptAndStore}
                                    disabled={!serverRecord || !messageInput}
                                >
                                    Encrypt & Store
                                </button>
                                <button
                                    className="px-4 bg-white text-orange-600 border border-orange-300 py-2 rounded-lg font-medium text-sm transition-all hover:bg-orange-50"
                                    onClick={() => setMessageInput('')}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Option 2: Decrypt Custom Message */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-800 mb-2">
                                    Decrypt Custom Message
                                </h3>
                                <p className="text-blue-700 text-sm mb-3">
                                    Paste any encrypted message to decrypt it.
                                </p>
                                <textarea
                                    value={customEncryptedMessage}
                                    onChange={(e) => setCustomEncryptedMessage(e.target.value)}
                                    placeholder="Paste your encrypted PGP message here..."
                                    className="w-full h-24 p-3 border focus:outline-none border-gray-300 rounded-lg text-sm resize-none mb-3"
                                />
                                <button
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleDecryptCustomMessage}
                                >
                                    Decrypt Message
                                </button>
                                {decryptedMessage && <div className="p-3 mt-3 bg-white rounded border border-gray-200">
                                    <pre className="text-sm whitespace-pre-wrap">{decryptedMessage}</pre>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Panel - Detailed Log */}
            <div className="w-[30%] bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        Activity Log
                    </h4>
                </div>
                <StepProgress activeTab={activeTab} steps={steps} />
            </div>

            {/* Right Panel - Server Storage */}
            <RightPanel
                onClear={handleLogout}
                serverRecord={serverRecord}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard} />
        </div>
    );
}
