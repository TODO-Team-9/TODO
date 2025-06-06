import sql from "../config/db";
import bcrypt from "bcrypt";
import { SystemRoles } from "../constants/db.constants";
import { SALT_ROUNDS } from "../constants/bcrypt.constants";
import crypto from "crypto";

export interface User {
  userId: number;
  username: string;
  emailAddress: string;
  passwordHash: string;
  twoFactorSecret: string;
  systemRoleId: number;
}

export interface UserRegistration {
  username: string;
  emailAddress: string;
  password: string;
}

const INITIALIZATION_VECTOR_LENGTH = 16;

function encrypt(text: string): string {
  if (!process.env.TWOFA_ENCRYPTION_KEY) {
    throw new Error("TWOFA_ENCRYPTION_KEY environment variable is not set.");
  }
  const iv = crypto.randomBytes(INITIALIZATION_VECTOR_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.TWOFA_ENCRYPTION_KEY),
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

function decrypt(text: string): string {
  if (!process.env.TWOFA_ENCRYPTION_KEY) {
    throw new Error("TWOFA_ENCRYPTION_KEY environment variable is not set.");
  }
  const textParts = text.split(":");
  const iv = Buffer.from(textParts[0], "hex");
  const tag = Buffer.from(textParts[1], "hex");
  const encryptedText = Buffer.from(textParts[2], "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(process.env.TWOFA_ENCRYPTION_KEY),
    iv
  );
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function createUser(user: UserRegistration): Promise<User> {
  const { username, emailAddress, password } = user;
  const passwordHash = await hashPassword(password);
  const twoFactorSecret = "";

  try {
    const result = await sql<User[]>`
      INSERT INTO users (username, email_address, password_hash, two_factor_secret, system_role_id) 
      VALUES (${username}, ${emailAddress}, ${passwordHash}, ${twoFactorSecret}, ${SystemRoles.SYSTEM_USER}) 
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

function processUserResult(user: User): User {
  if (user.twoFactorSecret) {
    user.twoFactorSecret = decrypt(user.twoFactorSecret);
  }
  return user;
}

async function findByUsername(username: string): Promise<User | null> {
  try {
    const result = await sql<User[]>`
      SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at FROM users WHERE username = ${username}
    `;
    if (result.length) {
      return processUserResult(result[0]);
    }
    return null;
  } catch (error) {
    console.error("Error finding user by username:", error);
    throw error;
  }
}

async function findByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql<User[]>`
      SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at FROM users WHERE email_address = ${email}
    `;
    if (result.length) {
      return processUserResult(result[0]);
    }
    return null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

async function findById(userId: number): Promise<User | null> {
  try {
    const result = await sql<User[]>`
      SELECT user_id, username, email_address, password_hash, two_factor_secret, system_role_id, deactivated_at FROM users WHERE user_id = ${userId}
    `;
    if (result.length) {
      return processUserResult(result[0]);
    }
    return null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
}

async function setTwoFactorSecret(
  userId: number,
  secret: string
): Promise<void> {
  const encryptedSecret = encrypt(secret);
  await sql`
    UPDATE users SET two_factor_secret = ${encryptedSecret} WHERE user_id = ${userId}
  `;
}

function pepperCheck(): void {
  if (!process.env.PEPPER) {
    throw new Error("PEPPER environment variable is not set.");
  }
}

async function hashPassword(password: string): Promise<string> {
  pepperCheck();
  return await bcrypt.hash(password + process.env.PEPPER, SALT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  pepperCheck();
  return await bcrypt.compare(password + process.env.PEPPER, hash);
}

const UserModel = {
  createUser,
  findByUsername,
  findByEmail,
  findById,
  hashPassword,
  verifyPassword,
  setTwoFactorSecret,
};

export default UserModel;
