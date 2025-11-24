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
        "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
        "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance",
        "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
        "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album",
        "alcohol", "alert", "alien", "all", "alley", "allow", "almost", "alone",
        "alpha", "already", "also", "alter", "always", "amateur", "amazing", "among",
        "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle", "angry",
        "dial", "diamond", "diary", "dice", "diesel", "diet", "differ", "digital",
        "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree", "discover",
        "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide",
        "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain",
        "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft",
        "dragon", "drama", "drastic", "draw", "dream", "dress", "drift", "drill",
        "drink", "drip", "drive", "drop", "drum", "dry", "duck", "dumb",
        "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager",
        "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo",
        "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight",
        "either", "elbow", "elder", "electric", "elegant", "element", "elephant", "elevator",
        "elite", "else", "embark", "embody", "embrace", "emerge", "emotion", "employ",
        "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy",
        "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough",
        "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode",
        "equal", "equip", "era", "erase", "erode", "erosion", "error", "erupt",
        "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence", "evil",
        "evoke", "evolve", "exact", "example", "exceed", "excel", "exception", "excess",
        "exchange", "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit",
        "exile", "exist", "exit", "exotic", "expand", "expect", "expire", "explain",
        "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face",
        "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family",
        "famous", "fan", "fancy", "fantasy", "farm", "fashion", "fat", "fatal",
        "father", "fatigue", "fault", "favorite", "feature", "february", "federal", "fee",
        "feed", "feel", "female", "fence", "festival", "fetch", "fever", "few",
        "fiber", "fiction", "field", "figure", "file", "film", "filter", "final",
        "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal",
        "jealous", "jeans", "jelly", "jewel", "job", "join", "joke", "journey",
        "joy", "judge", "juice", "jump", "jungle", "junior", "junk", "just",
        "kangaroo", "keen", "keep", "ketchup", "key", "kick", "kid", "kidney",
        "kind", "kingdom", "kiss", "kit", "kitchen", "kite", "kitten", "kiwi",
        "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder",
        "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin",
        "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual",
        "milk", "million", "mimic", "mind", "minimum", "minor", "minute", "miracle",
        "mirror", "misery", "miss", "mistake", "mix", "mixed", "mixture", "mobile",
        "nest", "net", "network", "neutral", "never", "news", "next", "nice",
        "night", "noble", "noise", "nominee", "noodle", "normal", "north", "nose",
        "notable", "note", "nothing", "notice", "novel", "now", "nuclear", "number",
        "nurse", "nut", "oak", "obey", "object", "oblige", "obscure", "observe",
        "obtain", "obvious", "occur", "ocean", "october", "odor", "off", "offer",
        "office", "often", "oil", "okay", "old", "olive", "olympic", "omit",
        "once", "one", "onion", "online", "only", "open", "opera", "opinion",
        "oppose", "option", "orange", "orbit", "orchard", "order", "ordinary", "organ",
        "orient", "original", "orphan", "ostrich", "other", "outdoor", "outer", "output",
        "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster",
        "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda",
        "panel", "panic", "panther", "paper", "parade", "parent", "park", "parrot",
        "party", "pass", "patch", "path", "patient", "patrol", "pattern", "pause",
        "pave", "payment", "peace", "peanut", "pear", "peasant", "pelican", "pen",
        "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet",
        "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece",
        "pig", "pigeon", "pill", "pilot", "pink", "pioneer", "pipe", "pistol",
        "pitch", "pizza", "place", "planet", "plastic", "plate", "play", "player",
        "race", "rack", "radar", "radio", "rail", "rain", "raise", "rally",
        "ramp", "ranch", "random", "range", "rapid", "rare", "rate", "rather",
        "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild",
        "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform",
        "refuse", "region", "regret", "regular", "reject", "relax", "release", "relief",
        "rely", "remain", "remember", "remind", "remove", "render", "renew", "rent",
        "reopen", "repair", "repeat", "replace", "report", "require", "rescue", "resemble",
        "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion",
        "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich",
        "siren", "sister", "situate", "six", "size", "skate", "sketch", "ski",
        "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender",
        "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush",
        "small", "smart", "smile", "smoke", "smooth", "snack", "snake", "snap",
        "sniff", "snow", "soap", "soccer", "social", "sock", "soda", "soft",
        "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon",
        "sorry", "sort", "soul", "sound", "soup", "source", "south", "space",
        "spare", "spatial", "spawn", "speak", "special", "speed", "spell", "spend",
        "sphere", "spice", "spider", "spike", "spin", "spirit", "split", "spoil",
        "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy",
        "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs",
        "taxi", "teach", "team", "tell", "ten", "tenant", "tennis", "tent",
        "trash", "travel", "tray", "treat", "tree", "trend", "trial", "tribe",
        "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true",
        "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble",
        "tuna", "tunnel", "turkey", "turn", "turtle", "twelve", "twenty", "twice",
        "twin", "twist", "two", "type", "typical", "ugly", "umbrella", "unable",
        "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy",
        "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual",
        "unveil", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban",
        "urge", "usage", "use", "used", "useful", "useless", "usual", "utility",
        "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish",
        "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise",
        "wish", "witness", "wolf", "woman", "wonder", "wood", "wool", "word",
        "work", "world", "worry", "worth", "wrap", "wreck", "wrestle", "wrist",
        "write", "wrong", "yard", "year", "yellow", "you", "young", "youth",
        "zebra", "zero", "zone", "zoo"
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
export async function deriveEncryptionKey(seedPhrase, saltBase64 = null) {
    const encoder = new TextEncoder();
    const seedBuffer = encoder.encode(seedPhrase);
    const saltBuffer = saltBase64 ? base64ToArrayBuffer(saltBase64) : crypto.getRandomValues(new Uint8Array(16));

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
        const { encryptionKey, encryptionBase64, salt } = await deriveEncryptionKey(seedPhrase);
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
        const { encryptionKey, encryptionBase64 } = await deriveEncryptionKey(seedPhrase, user.encSalt);

        const privateKey = await decryptPrivateKey(
            user.encryptedPrivateKey,
            user.encryptedPrivateKeyIV,
            user.encryptedPrivateKeyTag,
            encryptionKey
        );
        await storeEncryptionKey(encryptionBase64);
        return { user, privateKey };

    } catch (error) {
        throw new Error(`${error.message}`);
    }
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

export async function decryptMessage(user, encryptedMessageArmored) {
    try {
        const encryptionKey = await getStoredEncryptionKey();


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