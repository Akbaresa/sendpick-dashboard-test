import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "sendpick_secret_key";

/**
 * Enkripsi ID agar bisa dikirim via URL (tanpa karakter /, +, =)
 */
export const encryptId = (id: number | string): string => {
  const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
  // Convert ke URL-safe base64 (hilangkan '/', '+', '=')
  return encrypted
    .replace(/\+/g, "-") // ubah + jadi -
    .replace(/\//g, "_") // ubah / jadi _
    .replace(/=+$/, ""); // hapus tanda =
};

/**
 * Dekripsi ID dari URL-safe format
 */
export const decryptId = (cipherText: string): string => {
  // Kembalikan ke base64 normal
  const normalized = cipherText
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const bytes = CryptoJS.AES.decrypt(normalized, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) throw new Error("Invalid ID or decryption failed");
  return decrypted;
};
