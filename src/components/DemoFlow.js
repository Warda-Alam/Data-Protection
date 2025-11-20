import React, { useState, useEffect } from 'react';
import {
    generateSeedPhrase,
    performProductionSignup,
    encryptAndStoreMessage, 
    decryptMessage,
} from '../utils/cryptoOperations';
import { StepProgress } from './ActivityLog';
import { RightPanel } from './RightPanel';

// Define step structure
const STEP_STRUCTURE = {
    GENERATE_SEED: {
        id: 'step1',
        title: '🌱 STEP 1: Generate Seeds',
        description: 'Creating cryptographically secure 12-word seed phrase',
        status: 'pending',
        substeps: [
            'Seeds never leaves your browser.',
            'Ready for cryptographic operations'
        ]
    },
    SIGNUP: {
        id: 'step2',
        title: '🔐 STEP 2: Signup',
        description: 'Creating your secure account with encrypted keys',
        status: 'pending',
        substeps: [
            'Deriving cryptographic keys(Login Hash + Encryption Key) from seeds',
            'Generating PGP key pair',
            'Encrypting private key using AES-256-GCM with derived (Encryption Key)',
            'Storing encrypted data on server'
        ]
    },
    ENCRYPT_MESSAGE: {
        id: 'step3',
        title: '🔒 STEP 3: Encrypt Message',
        description: 'Encrypting your message using public key cryptography',
        status: 'pending',
        substeps: [
            'Using stored public key for encryption',
            'Creating PGP encrypted message',
            'Storing encrypted message on server'
        ]
    },
    DECRYPT_MESSAGE: {
        id: 'step4',
        title: '🔓 STEP 4: Decrypt Message',
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
    const [serverRecord, setServerRecord] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [decryptedMessage, setDecryptedMessage] = useState(null);

    // New structured state for steps
    const [steps, setSteps] = useState({
        step1: { ...STEP_STRUCTURE.GENERATE_SEED, status: 'pending' },
        step2: { ...STEP_STRUCTURE.SIGNUP, status: 'pending' },
        step3: { ...STEP_STRUCTURE.ENCRYPT_MESSAGE, status: 'pending' },
        step4: { ...STEP_STRUCTURE.DECRYPT_MESSAGE, status: 'pending' }
    });

    // Helper function to update step status
    const updateStep = (stepId, updates) => {
        setSteps(prev => ({
            ...prev,
            [stepId]: { ...prev[stepId], ...updates }
        }));
    };
    const [customEncryptedMessage, setCustomEncryptedMessage] = useState('');

    // Helper function to mark substep as completed
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

    // Load saved production-users (simulate server storage)
    useEffect(() => {
        try {
            const usersData = localStorage.getItem('production-users');
            if (usersData) {
                const users = JSON.parse(usersData);
                if (Array.isArray(users) && users.length > 0) {
                    setServerRecord(users[users.length - 1]);
                } else if (typeof users === 'object' && users !== null) {
                    setServerRecord(users);
                    localStorage.setItem('production-users', JSON.stringify([users]));
                }
            }
        } catch (error) {
            console.error('Error loading server records:', error);
            localStorage.removeItem('production-users');
        }
    }, []);

    async function handleGenerateSeed() {
        updateStep('step1', { status: 'active' });

        const s = await generateSeedPhrase();
        setSeed(s);
        setStep('generated');
        updateStep('step1', {
            status: 'completed',
            completedSubsteps: [0, 1] 
        });
    }

    async function handleSignupAuto() {
        setStep('signup');

        updateStep('step2', { status: 'active' });
        try {
            completeSubstep('step2', 0);

            const results = await performProductionSignup();

            completeSubstep('step2', 1);
            completeSubstep('step2', 2);
            setServerRecord(results.serverRecord);
            setStep('ready');
            completeSubstep('step2', 3);
            updateStep('step2', { status: 'completed' });

        } catch (err) {
            console.error(err);
            updateStep('step2', { status: 'error' });
            alert('Signup failed: ' + err.message);
            setStep('generated');
        }
    }

    async function handleEncryptAndStore() {
        updateStep('step3', { status: 'active' });

        try {
            completeSubstep('step3', 0);

            const pub = serverRecord.publicKey;
            const result = await encryptAndStoreMessage(messageInput, pub, serverRecord.loginHash);
            completeSubstep('step3', 1);

            setServerRecord(result.storageResult.user);
            completeSubstep('step3', 2);
            updateStep('step3', { status: 'completed' });
            setMessageInput('');

        } catch (err) {
            console.error(err);
            updateStep('step3', { status: 'error' });
        }
    }

    // Option 2: Decrypt any message (manual input)
    async function handleDecryptCustomMessage() {
        setDecryptedMessage(null);
        updateStep('step4', { status: 'active' });

        try {
            completeSubstep('step4', 0);

            const decrypted = await decryptMessage(customEncryptedMessage.trim());

            completeSubstep('step4', 1);
            setDecryptedMessage(decrypted);

            completeSubstep('step4', 2);
            updateStep('step4', { status: 'completed' });
            completeSubstep('step4', 3);
             
        } catch (err) {
            console.error(err);
            updateStep('step4', { status: 'error' });
        }
    }

    // Reset all steps
    const resetAllSteps = () => {
        setSteps({
            step1: { ...STEP_STRUCTURE.GENERATE_SEED, status: 'pending' },
            step2: { ...STEP_STRUCTURE.SIGNUP, status: 'pending' },
            step3: { ...STEP_STRUCTURE.ENCRYPT_MESSAGE, status: 'pending' },
            step4: { ...STEP_STRUCTURE.DECRYPT_MESSAGE, status: 'pending' }
        });
    };


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
                <div className={`transition-all duration-300 ${activeTab === 'signup' ? 'block' : 'hidden'
                    }`}>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-2">
                                Step 1: Generate Seed
                            </h3>
                            <p className="text-blue-700 text-sm mb-3">
                                Create a secure seed phrase that never leaves your device. Used to derive all cryptographic keys.
                            </p>
                            <button
                                className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleGenerateSeed}
                                disabled={!!seed}
                            >
                                {seed ? 'Seed Generated' : 'Generate Seed'}
                            </button>
                        </div>

                        {seed && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-green-800 mb-3">Your Seed Phrase</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {seed.split(' ').map((w, i) => (
                                        <div key={i} className="bg-white border border-green-200 p-2 rounded text-sm text-center font-medium text-gray-700">
                                            <span className="text-xs text-gray-500">{i + 1}.</span> {w}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="font-semibold text-purple-800 mb-2">
                                Step 2: Signup
                            </h3>
                            <p className="text-purple-700 text-sm mb-3">
                                Create your account. Server stores only encrypted data - no access to your keys or seed.
                            </p>
                            <button
                                className="w-full mt-3 bg-purple-600 text-white py-3 rounded-lg font-semibold text-sm transition-all hover:bg-purple-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleSignupAuto}
                                disabled={!seed || step === 'signup' || step === 'ready'}
                            >
                                {step === 'signup' ? 'Signing up...' : 'Run Signup'}
                            </button>
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
                                    className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none mb-3"
                                />
                                <button
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleDecryptCustomMessage}
                                >
                                    Decrypt Message
                                </button>
                                <div className="p-3 mt-3 bg-white rounded border border-gray-200">
                                    <pre className="text-sm whitespace-pre-wrap">{decryptedMessage}</pre>
                                </div>
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
            <RightPanel serverRecord={serverRecord} setServerRecord={setServerRecord} />
        </div>
    );
}
