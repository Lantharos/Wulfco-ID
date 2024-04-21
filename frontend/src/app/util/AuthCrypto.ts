import {config} from "../config";

class KeyManagment {
    public base64SpkiToUint8Array(base64Spki: string) {
        const binaryStr = atob(base64Spki);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        return bytes;
    }

    public async fetchPublicKey() {
        const response = await fetch(config.api_url + "/public-key").catch(() => { throw new Error("Failed to fetch public key") });
        const base64Key = await response.json();

        // Assuming Base64-encoded ASN.1 DER format
        const spkiKey = this.base64SpkiToUint8Array(base64Key.publicKey); // (Implementation below)

        return await crypto.subtle.importKey(
            "spki",
            spkiKey,
            { name: "RSA-OAEP", hash: "SHA-256" }, // Make sure this matches backend padding
            false,
            ["encrypt"]
        );
    }
}

export class AuthCrypto {
    /*
    * This function encrypts given data using the server's public key
    * @input data: string
    * @output string
     */
    public async PublicEncrypt(data: string) {
        const KeyManager = new KeyManagment();

        const publicKey = await KeyManager.fetchPublicKey();

        const encryptedData = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            new TextEncoder().encode(data)
        );

        return new Uint8Array(encryptedData).toString();
    }

    /*
    * This function encrypts given data using AES
    * @input data: string
    * @input key: CryptoKey
    * @input iv: Uint8Array
    * @output string
     */
    public async AESEncrypt(data: string, key: CryptoKey, iv: Uint8Array) {
        const encoder = new TextEncoder();  // For text conversions

        const cipherText = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv, length: 256 },
            key,
            encoder.encode(data)
        );

        return new Uint8Array(cipherText).toString();
    }

    /*
    * This function decrypts given data using AES
    * @input data: Uint8Array
    * @input key: CryptoKey
    * @input iv: Uint8Array
    * @output string
     */
    public async AESDecrypt(data: Uint8Array, key: CryptoKey, iv: Uint8Array) {
        const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv },
            key,
            data
        );

        return new TextDecoder().decode(decryptedData);
    }

    /*
    * This function generates a new AES key
    * @output CryptoKey
    * @output iv: Uint8Array
    * @output string
     */
    public async GenerateAESKey() {
        return await crypto.subtle.generateKey(
            { name: "AES-CBC", length: 256 }, // 256-bit key
            true,                             // extractable
            ["encrypt", "decrypt"]            // key usages
        );
    }

    /*
    * This function encrypts given data using AES and then encrypts the symmetric key using the server's public key
    * @input data: string
    * @output {encryptedData: string, encryptedSymmetricKey: string, iv: string}
     */
    public async SimpleEncrypt(data: string) {
        const KeyManager = new KeyManagment();

        const symmetricKey = await crypto.subtle.generateKey(
            { name: "AES-CBC", length: 256 }, // 256-bit key
            true,                             // extractable
            ["encrypt", "decrypt"]            // key usages
        );

        const iv = crypto.getRandomValues(new Uint8Array(16)); // 16 bytes for AES-CBC
        const encoder = new TextEncoder();  // For text conversions

        const cipherText = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv },
            symmetricKey,
            encoder.encode(data)
        );

        const publicKey = await KeyManager.fetchPublicKey().catch(() => { throw new Error("Failed to fetch public key") });

        const encryptedKey = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            new Uint8Array(await crypto.subtle.exportKey("raw", symmetricKey)) // Export symmetric key as raw bytes
        );

        return {
            encryptedData: new Uint8Array(cipherText).toString(),
            encryptedSymmetricKey: new Uint8Array(encryptedKey).toString(),
            iv: new Uint8Array(iv).toString()
        };
    }

    public async Hash(data: string) {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data))
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join(''); // Convert to hex
    }

    public async KDF(data: string, salt: string) {
        const baseKey = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(data),
            {name: "PBKDF2"},
            false,
            ["deriveKey"]
        );

        return await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: new TextEncoder().encode(salt),
                iterations: 100000,
                hash: "sha-256"
            },
            baseKey,
            {name: "AES-CBC", length: 256},
            true,               // extractable
            ["encrypt", "decrypt"]
        );
    }

    public async ImportKey(key: Uint8Array) {
        return await crypto.subtle.importKey(
            "raw",
            key,
            { name: "AES-CBC", length: 256 }, // 256-bit key
            true,                             // extractable
            ["encrypt", "decrypt"]
        );
    }
}