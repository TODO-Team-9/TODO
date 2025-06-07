import crypto from "crypto";

const INITIALIZATION_VECTOR_LENGTH = 16;

export class EncryptionService {
  private static validateEncryptionKey(): void {
    if (!process.env.TWOFA_ENCRYPTION_KEY) {
      throw new Error("TWOFA_ENCRYPTION_KEY environment variable is not set.");
    }
  }

  static encrypt(text: string): string {
    this.validateEncryptionKey();
    const iv = crypto.randomBytes(INITIALIZATION_VECTOR_LENGTH);
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.TWOFA_ENCRYPTION_KEY!),
      iv
    );
    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const tag = cipher.getAuthTag();
    return (
      iv.toString("hex") +
      ":" +
      tag.toString("hex") +
      ":" +
      encrypted.toString("hex")
    );
  }

  static decrypt(text: string): string {
    this.validateEncryptionKey();
    const textParts = text.split(":");
    const iv = Buffer.from(textParts[0], "hex");
    const tag = Buffer.from(textParts[1], "hex");
    const encryptedText = Buffer.from(textParts[2], "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(process.env.TWOFA_ENCRYPTION_KEY!),
      iv
    );
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
} 