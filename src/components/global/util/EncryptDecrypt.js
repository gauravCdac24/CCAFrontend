import CryptoJS from 'crypto-js';

const encryptionKey = 'xljfljdfodflj;x2';
const iv = '1234567890123456';

export const encrypt = (dataToEncrypt) => {
    try {
        const textToEncrypt = String(dataToEncrypt);

        const key = CryptoJS.enc.Utf8.parse(encryptionKey);
        const ivHex = CryptoJS.enc.Utf8.parse(iv);
        const encrypted = CryptoJS.AES.encrypt(textToEncrypt, key, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return encrypted.toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

export const decrypt = (dataToDecrypt) => {
    const encryptedText = String(dataToDecrypt);

    try {
        const key = CryptoJS.enc.Utf8.parse(encryptionKey);
        const ivHex = CryptoJS.enc.Utf8.parse(iv);
        const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};
