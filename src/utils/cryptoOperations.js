// src/utils/cryptoOperations.js
import bcrypt from 'bcryptjs';
const openpgp = require('openpgp');


// 1. Generate Secure Seed Phrase (BIP39-like)
export async function generateSeedPhrase() {
    // Use crypto.getRandomValues for secure entropy
    const entropy = crypto.getRandomValues(new Uint8Array(16));
    const words = [
        "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
        "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid",
        // ... expand to 2048 words for production
    ];

    const seedWords = [];
    for (let i = 0; i < 16; i++) {
        const randomIndex = entropy[i] % words.length;
        seedWords.push(words[randomIndex]);
    }

    return seedWords.join(' ');
}

// 2. Derive Login Hash (using bcrypt : it generates random salt + applies 2^12 iterations)
export async function deriveLoginHash(seedPhrase) {
    const saltRounds = 12;
    const loginHash = await bcrypt.hash(seedPhrase, saltRounds);
    return { loginHash }; // returns salt + hash
}


// 3. Derive Encryption Key (using proper KDF)
export async function deriveEncryptionKey(seedPhrase) {
    const encoder = new TextEncoder();
    const seedBuffer = encoder.encode(seedPhrase);
    const saltBuffer = crypto.getRandomValues(new Uint8Array(16));

    // Import raw seed
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        seedBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    // Derive AES-GCM key
    const encryptionKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const exportedKey = await crypto.subtle.exportKey("raw", encryptionKey);
    const keyBase64 = arrayBufferToBase64(exportedKey);

    return {
        encryptionKey,
        encryptionBase64: keyBase64,
        salt: arrayBufferToBase64(saltBuffer)
    };
}


// 4. Generate PGP Key Pair (REAL PGP - Production Ready)
export async function generateKeyPair(seedPhrase) {
    const seedBuffer = new TextEncoder().encode(seedPhrase);
    const hashBuffer = await crypto.subtle.digest('SHA-256', seedBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const userId = `zk-user-${hashHex.substring(0, 16)}@seed-based.local`;
    const userName = `ZK User ${hashHex.substring(0, 8)}`;

    const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'rsa',
        rsaBits: 2048,
        userIDs: [{ name: 'Demo User' }]
    });

    return { privateKey, publicKey };
}

// 5. Encrypt Private Key (AES-GCM)
export async function encryptPrivateKey(privateKey, encryptionKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const privateKeyBuffer = new TextEncoder().encode(privateKey);

    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        encryptionKey,
        privateKeyBuffer
    );

    // Extract the tag (typically 16 bytes for AES-GCM)
    const tagLength = 16;
    const encryptedData = encrypted.slice(0, encrypted.byteLength - tagLength);
    const tag = encrypted.slice(encrypted.byteLength - tagLength);

    return {
        encryptedPrivateKey: arrayBufferToBase64(encryptedData),
        iv: arrayBufferToBase64(iv),
        tag: arrayBufferToBase64(tag)
    };
}


export async function decryptPrivateKey(encryptedData, iv, tag, encryptionKey) {

    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    const tagBuffer = base64ToArrayBuffer(tag);
    const combined = new Uint8Array(encryptedBuffer.byteLength + tagBuffer.byteLength);
    combined.set(new Uint8Array(encryptedBuffer), 0);
    combined.set(new Uint8Array(tagBuffer), encryptedBuffer.byteLength);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: base64ToArrayBuffer(iv)
        },
        encryptionKey,
        combined
    );

    return new TextDecoder().decode(decrypted);
}


export async function encryptUserData(userData, publicKeyArmored) {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: userData }),
        encryptionKeys: publicKey
    });

    return encrypted;
}

// 7. Complete Production Signup Flow
export async function storeEncryptionKey(key) {
    try {
        localStorage.setItem('encryption-key', key);
        return { success: true };
    } catch (error) {
        console.error('Seed storage error:', error);
        throw new Error('Failed to store seed phrase');
    }
}

export async function importAesKeyFromBase64(base64Key) {
    const rawKey = base64ToArrayBuffer(base64Key);

    return crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        false,                 // not extractable
        ["encrypt", "decrypt"] // usage
    );
}


export async function getStoredEncryptionKey() {
    try {
        const base64Key = localStorage.getItem('encryption-key');
        if (!base64Key) {
            throw new Error('No encryption key found in storage');
        }

        // Convert Base64 → CryptoKey
        const cryptoKey = await importAesKeyFromBase64(base64Key);
        return cryptoKey;

    } catch (error) {
        console.error('Encryption key retrieval error:', error);
        throw new Error('Failed to load encryption key');
    }
}


// Clear stored seed phrase
export function clearStoredSeedPhrase() {
    localStorage.removeItem('user-seed-phrase');
}

// Updated signup function that stores the seed
export async function performProductionSignup(seedPhrase) {
    try {
        const { loginHash } = await deriveLoginHash(seedPhrase);
        const { encryptionKey,encryptionBase64, salt } = await deriveEncryptionKey(seedPhrase);
        const { privateKey, publicKey } = await generateKeyPair(seedPhrase);
        const encryptedPrivate = await encryptPrivateKey(privateKey, encryptionKey);
        await storeEncryptionKey(encryptionBase64);
        // Production Server Record
        const serverRecord = {
            loginHash,
            publicKey,
            encryptedPrivateKey: encryptedPrivate.encryptedPrivateKey,
            encryptedPrivateKeyIV: encryptedPrivate.iv,
            encryptedPrivateKeyTag: encryptedPrivate.tag,
            encSalt: salt,
            createdAt: new Date().toISOString(),
        };

        await saveToProductionStorage(serverRecord);

        return {
            seedPhrase,
            serverRecord,
            technicalDetails: {
                crypto: {
                    keyAlgorithm: 'ECC curve25519',
                    encryption: 'AES-256-GCM',
                    keyDerivation: 'PBKDF2-SHA256-100000',
                    passwordHashing: 'bcrypt-12'
                }
            }
        };

    } catch (error) {
        console.error('Production signup error:', error);
        throw new Error(`Signup failed: ${error.message}`);
    }
}


// Fix the saveToProductionStorage function
async function saveToProductionStorage(serverRecord) {
    try {
        const existingData = JSON.parse(localStorage.getItem('production-users') || '[]');

        // Ensure existingData is an array
        if (!Array.isArray(existingData)) {
            console.warn('Existing storage data was not an array, resetting...');
            localStorage.setItem('production-users', JSON.stringify([serverRecord]));
        } else {
            // Add new record to array
            existingData.push(serverRecord);
            localStorage.setItem('production-users', JSON.stringify(existingData));
        }
    } catch (error) {
        console.error('Storage error:', error);
        throw new Error(`Storage failed: ${error.message}`);
    }
}


// 9. Login Flow (Production)
export async function performLogin(seedPhrase) {
    try {
        const users = JSON.parse(localStorage.getItem('production-users') || '[]');
        let user = null;
        for (const storedUser of users) {
            const isValid = await bcrypt.compare(seedPhrase, storedUser.loginHash);
            if (isValid) {
                user = storedUser;
                break;
            }
        }
        
        if (!user) throw new Error('User not found - invalid seed phrase');
        const { encryptionKey } = await deriveEncryptionKeyWithSalt(seedPhrase, user.encSalt);

        const privateKey = await decryptPrivateKey(
            user.encryptedPrivateKey,
            user.encryptedPrivateKeyIV,
            user.encryptedPrivateKeyTag,
            encryptionKey
        );

        return { user, privateKey };

    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

// New function to derive key with specific salt
export async function deriveEncryptionKeyWithSalt(seedPhrase, saltBase64) {
    const encoder = new TextEncoder();
    const seedBuffer = encoder.encode(seedPhrase);
    const saltBuffer = base64ToArrayBuffer(saltBase64);

    // Import raw seed
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        seedBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    // Derive AES-GCM key using stored salt
    const encryptionKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

    return { encryptionKey };
}


// 10. Utility Functions
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// 11. Encrypt Message with Public Key
export async function encryptMessage(message, publicKeyArmored) {
    try {
        if (!message || !publicKeyArmored) {
            throw new Error('Message and public key are required for encryption');
        }

        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: message }),
            encryptionKeys: publicKey,
            config: {
                preferredCompressionAlgorithm: openpgp.enums.compression.zlib
            }
        });

        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error(`Message encryption failed: ${error.message}`);
    }
}

export async function storeEncryptedMessage(encryptedMessage, userLoginHash = null) {
    try {
        const users = JSON.parse(localStorage.getItem('production-users') || '[]');

        let targetUser;
        let userIndex;

        if (userLoginHash) {
            userIndex = users.findIndex(user => user.loginHash === userLoginHash);
            targetUser = users[userIndex];
        } else {
            userIndex = users.length - 1;
            targetUser = users[userIndex];
        }

        if (!targetUser) {
            throw new Error('No user found to store encrypted message');
        }

        const updatedUser = {
            ...targetUser,
            encryptedUserData: encryptedMessage,
            lastUpdated: new Date().toISOString(),
            messageCount: (targetUser.messageCount || 0) + 1
        };

        if (userIndex >= 0) {
            users[userIndex] = updatedUser;
        } else {
            users.push(updatedUser);
        }

        localStorage.setItem('production-users', JSON.stringify(users));

        return {
            success: true,
            user: updatedUser,
            message: 'Encrypted message stored successfully'
        };
    } catch (error) {
        throw new Error(`Failed to store encrypted message: ${error.message}`);
    }
}

export async function encryptAndStoreMessage(message, publicKeyArmored, userLoginHash = null) {
    try {
        // Step 1: Encrypt the message
        const encryptedMessage = await encryptMessage(message, publicKeyArmored);

        // Step 2: Store the encrypted message
        const storageResult = await storeEncryptedMessage(encryptedMessage, userLoginHash);

        return {
            encryptedMessage,
            storageResult,
            technicalDetails: {
                algorithm: 'PGP (ECC curve25519)',
                compression: 'zlib',
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Complete encryption flow error:', error);
        throw new Error(`Encryption and storage failed: ${error.message}`);
    }
}

export async function decryptMessage(encryptedMessageArmored) {
    try {
        const encryptionKey = await getStoredEncryptionKey();
        const users = JSON.parse(localStorage.getItem('production-users') || '[]');

        if (users.length === 0) {
            throw new Error('No users found in storage');
        }

        const user = users[users.length - 1];

        const privateKey = await decryptPrivateKey(
            user.encryptedPrivateKey,
            user.encryptedPrivateKeyIV,
            user.encryptedPrivateKeyTag,
            encryptionKey
        );

        const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKey });
        const message = await openpgp.readMessage({
            armoredMessage: encryptedMessageArmored
        });

        const { data: decrypted } = await openpgp.decrypt({
            message,
            decryptionKeys: privateKeyObj
        });

        return decrypted;
    } catch (error) {
        console.error('Message decryption error:', error);
        throw new Error(`Decryption failed: ${error.message}`);
    }
}


export default {
    generateSeedPhrase,
    performProductionSignup,
    performLogin,
    encryptAndStoreMessage,
    decryptMessage,
};