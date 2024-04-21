import crypto from "crypto";
import forge from "node-forge";

export default class CryptoHelper {
    public decryptPrivateKey(data: Uint8Array): Uint8Array {
        return crypto.privateDecrypt({key: process.env.SERVER_PRIVATE_KEY, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256"}, data)
    }

    public decryptAES(data: Uint8Array, key: crypto.KeyObject, iv: Uint8Array, algorithm: string) {
        try {
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            let decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
            return decrypted.toString('utf8');
        } catch (e) {
            console.log(e)
            return false
        }
    }

    public encryptAES(data: string, key: crypto.KeyObject, iv: Uint8Array, algorithm: string): Buffer {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }

    public generateAESKey(): crypto.KeyObject {
        return crypto.createSecretKey(crypto.randomBytes(32));
    }

    public createPublicKey(): string {
        const privateKeyPem = process.env.SERVER_PRIVATE_KEY;
        const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

        const publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);

        const spki = forge.pki.publicKeyToAsn1(publicKey);

        return forge.util.encode64(forge.asn1.toDer(spki).getBytes());
    }

    public KDF(password: string, salt: string): crypto.KeyObject {
        return crypto.createSecretKey(crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256'));
    }

    public encryptPublicKey(data: Uint8Array): Buffer {
        return crypto.publicEncrypt({key: process.env.SERVER_PRIVATE_KEY, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256"}, data);
    }

    public SimpleDecrypt(base64EncodedEncryptedData: string, base64EncodedEncryptedSymmetricKey: string, base64EncodedIv: string) {
        const encryptedData = new Uint8Array(base64EncodedEncryptedData.split(',').map(Number))
        const encryptedSymmetricKey = new Uint8Array(base64EncodedEncryptedSymmetricKey.split(',').map(Number))
        const iv = new Uint8Array(base64EncodedIv.split(',').map(Number))

        const decryptedRawSymmetricKey = this.decryptPrivateKey(encryptedSymmetricKey)
        const key = crypto.createSecretKey(decryptedRawSymmetricKey)

        const result = this.decryptAES(encryptedData, key, iv, 'aes-256-cbc')
        if (result) { return result } else { return false }
    }

    public Hash(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}