import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel, { UserRegistration } from "../models/user.model";
import { generateTOTPSecret, verifyTOTPToken } from "../services/totp.service";
import { validatePassword } from "../utils/password.utils";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, emailAddress, password } = req.body;

    if (!username || !emailAddress || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        error: "Password does not meet complexity requirements",
        details: passwordValidation.errors,
      });
      return;
    }

    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    const existingEmail = await UserModel.findByEmail(emailAddress);
    if (existingEmail) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const userData: UserRegistration = {
      username,
      emailAddress,
      password,
    };

    const newUser = await UserModel.createUser(userData);
    if (!newUser) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }
    const totp = await generateTOTPSecret(newUser.username);
    const { passwordHash, ...userWithoutSensitiveData } = newUser;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutSensitiveData,
      twoFactor: {
        secret: totp.base32,
        qrCodeDataURL: totp.qrCodeDataURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await UserModel.findByUsername(username);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await UserModel.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (user.twoFactorSecret) {
      const { token } = req.body;
      if (!token) {
        res.status(401).json({ error: "TOTP token required" });
        return;
      }
      const isTokenValid = verifyTOTPToken(user.twoFactorSecret, token);
      if (!isTokenValid) {
        res.status(401).json({ error: "Invalid TOTP token" });
        return;
      }
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ error: "JWT secret is not configured" });
      return;
    }

    const tokenJwt = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        role: user.systemRoleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: "Login successful",
      token: tokenJwt,
      user: {
        userId: user.userId,
        username: user.username,
        emailAddress: user.emailAddress,
        systemRoleId: user.systemRoleId,
        twoFactorEnabled: !!user.twoFactorSecret,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
}

// Generate 2FA setup for authenticated user
export async function generate2FA(req: Request, res: Response) {
  const userId = req.user?.userId;
  const username = req.user?.username;

  if (!userId || !username) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const totp = await generateTOTPSecret(username);
    res.json({
      message: "2FA setup generated",
      twoFactor: {
        secret: totp.base32,
        qrCodeDataURL: totp.qrCodeDataURL,
      },
    });
  } catch (error) {
    console.error("Generate 2FA error:", error);
    res.status(500).json({ error: "Failed to generate 2FA setup" });
  }
}

// Enable 2FA for a user (save TOTP secret)
export async function enable2FA(req: Request, res: Response) {
  const userId = req.user?.userId;
  const { secret, token } = req.body;

  if (!userId || !secret || !token) {
    return res.status(400).json({ error: "Missing user, secret, or token" });
  }

  try {
    // Verify the token first
    const isTokenValid = verifyTOTPToken(secret, token);
    if (!isTokenValid) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await UserModel.setTwoFactorSecret(userId, secret);
    res.json({ message: "2FA enabled successfully" });
  } catch (err) {
    console.error("Enable 2FA error:", err);
    res.status(500).json({ error: "Failed to enable 2FA" });
  }
}

// Disable 2FA for a user (remove TOTP secret)
export async function disable2FA(req: Request, res: Response) {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    await UserModel.setTwoFactorSecret(userId, "");
    res.json({ message: "2FA disabled successfully" });
  } catch (err) {
    console.error("Disable 2FA error:", err);
    res.status(500).json({ error: "Failed to disable 2FA" });
  }
}
