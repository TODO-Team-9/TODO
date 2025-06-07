import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";
import { generateTOTPSecret, verifyTOTPToken } from "../services/totp.service";
import { HTTP_Status } from "../enums/HTTP_Status";

const userService = new UserService();

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, emailAddress, password } = req.body;

    if (!username || !emailAddress || !password) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: "All fields are required" });
      return;
    }

    const existingUsername = await userService.findByUsername(username);
    if (existingUsername) {
      res.status(HTTP_Status.CONFLICT).json({ error: "Username already exists" });
      return;
    }

    const existingEmail = await userService.findByEmail(emailAddress);
    if (existingEmail) {
      res.status(HTTP_Status.CONFLICT).json({ error: "Email already exists" });
      return;
    }

    const newUser = await userService.createUser({ username, emailAddress, password });
    const totp = await generateTOTPSecret(newUser.username);
    const { passwordHash, ...userWithoutSensitiveData } = newUser;

    res.status(HTTP_Status.CREATED).json({
      message: "User registered successfully",
      user: userWithoutSensitiveData,
      twoFactor: {
        secret: totp.base32,
        qrCodeDataURL: totp.qrCodeDataURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to register user" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: "Username and password are required" });
      return;
    }

    const user = await userService.findByUsername(username);
    if (!user) {
      res.status(HTTP_Status.UNAUTHORIZED).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await userService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(HTTP_Status.UNAUTHORIZED).json({ error: "Invalid credentials" });
      return;
    }

    if (user.twoFactorSecret) {
      const { token } = req.body;
      if (!token) {
        res.status(HTTP_Status.UNAUTHORIZED).json({ error: "TOTP token required" });
        return;
      }
      const isTokenValid = verifyTOTPToken(user.twoFactorSecret, token);
      if (!isTokenValid) {
        res.status(HTTP_Status.UNAUTHORIZED).json({ error: "Invalid TOTP token" });
        return;
      }
    }

    if (!process.env.JWT_SECRET) {
      res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "JWT secret is not configured" });
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

    res.status(HTTP_Status.OK).json({
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
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to login" });
  }
}

export async function generate2FA(req: Request, res: Response): Promise<void> {
  const userId = req.user?.userId;
  const username = req.user?.username;

  if (!userId || !username) {
    res.status(HTTP_Status.UNAUTHORIZED).json({ error: "User not authenticated" });
    return;
  }

  try {
    const totp = await generateTOTPSecret(username);
    res.status(HTTP_Status.OK).json({
      message: "2FA setup generated",
      twoFactor: {
        secret: totp.base32,
        qrCodeDataURL: totp.qrCodeDataURL,
      },
    });
  } catch (error) {
    console.error("Generate 2FA error:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to generate 2FA setup" });
  }
}

export async function enable2FA(req: Request, res: Response): Promise<void> {
  const userId = req.user?.userId;
  const { secret, token } = req.body;

  if (!userId || !secret || !token) {
    res.status(HTTP_Status.BAD_REQUEST).json({ error: "Missing user, secret, or token" });
    return;
  }

  try {
    const isTokenValid = verifyTOTPToken(secret, token);
    if (!isTokenValid) {
      res.status(HTTP_Status.BAD_REQUEST).json({ error: "Invalid verification code" });
      return;
    }

    await userService.setTwoFactorSecret(userId, secret);
    res.status(HTTP_Status.OK).json({ message: "2FA enabled successfully" });
  } catch (error) {
    console.error("Enable 2FA error:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to enable 2FA" });
  }
}

export async function disable2FA(req: Request, res: Response): Promise<void> {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(HTTP_Status.UNAUTHORIZED).json({ error: "User not authenticated" });
    return;
  }

  try {
    await userService.setTwoFactorSecret(userId, "");
    res.status(HTTP_Status.OK).json({ message: "2FA disabled successfully" });
  } catch (error) {
    console.error("Disable 2FA error:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to disable 2FA" });
  }
}
