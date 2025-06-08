import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";
import { generateTOTPSecret, verifyTOTPToken } from "../services/totp.service";
import { validatePassword } from "../utils/password.utils";
import { validateUsername } from "../utils/username.utils";
import { HTTP_Status } from "../enums/HTTP_Status";

const userService = new UserService();

export async function register(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { username, emailAddress, password } = request.body;

    if (!username || !emailAddress || !password) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "All fields are required" });
      return;
    } // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Password does not meet complexity requirements",
        details: passwordValidation.errors,
      });
      return;
    }

    // Validate username format
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Username does not meet requirements",
        details: usernameValidation.errors,
      });
      return;
    }

    const existingUsername = await userService.findByUsername(username);
    if (existingUsername) {
      response
        .status(HTTP_Status.CONFLICT)
        .json({ error: "Username already exists" });
      return;
    }

    const existingEmail = await userService.findByEmail(emailAddress);
    if (existingEmail) {
      response
        .status(HTTP_Status.CONFLICT)
        .json({ error: "Email already exists" });
      return;
    }

    const newUser = await userService.createUser({
      username,
      emailAddress,
      password,
    });
    const totp = await generateTOTPSecret(newUser.username);
    const { passwordHash, ...userWithoutSensitiveData } = newUser;

    response.status(HTTP_Status.CREATED).json({
      message: "User registered successfully",
      user: userWithoutSensitiveData,
      twoFactor: {
        secret: totp.base32,
        qrCodeDataURL: totp.qrCodeDataURL,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to register user" });
  }
}

export async function login(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "Username and password are required" });
      return;
    }

    const user = await userService.findByUsername(username);
    if (!user) {
      response
        .status(HTTP_Status.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await userService.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      response
        .status(HTTP_Status.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }

    if (user.twoFactorSecret) {
      const { token } = request.body;
      if (!token) {
        response
          .status(HTTP_Status.UNAUTHORIZED)
          .json({ error: "TOTP token required" });
        return;
      }
      const isTokenValid = verifyTOTPToken(user.twoFactorSecret, token);
      if (!isTokenValid) {
        response
          .status(HTTP_Status.UNAUTHORIZED)
          .json({ error: "Invalid TOTP token" });
        return;
      }
    }

    if (!process.env.JWT_SECRET) {
      response
        .status(HTTP_Status.INTERNAL_SERVER_ERROR)
        .json({ error: "JWT secret is not configured" });
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

    response.status(HTTP_Status.OK).json({
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
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to login" });
  }
}

export async function generate2FA(
  request: Request,
  response: Response
): Promise<void> {
  const userId = request.user?.userId;
  const username = request.user?.username;

  if (!userId || !username) {
    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
    return;
  }

  try {
    const totp = await generateTOTPSecret(username);
    response.status(HTTP_Status.OK).json({
      message: "2FA setup generated",
      twoFactor: {
        secret: totp.base32,
        qrCodeDataURL: totp.qrCodeDataURL,
      },
    });
  } catch (error) {
    console.error("Generate 2FA error:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to generate 2FA setup" });
  }
}

export async function enable2FA(
  request: Request,
  response: Response
): Promise<void> {
  const userId = request.user?.userId;
  const { secret, token } = request.body;

  if (!userId || !secret || !token) {
    response
      .status(HTTP_Status.BAD_REQUEST)
      .json({ error: "Missing user, secret, or token" });
    return;
  }

  try {
    const isTokenValid = verifyTOTPToken(secret, token);
    if (!isTokenValid) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "Invalid verification code" });
      return;
    }

    await userService.setTwoFactorSecret(userId, secret);
    response
      .status(HTTP_Status.OK)
      .json({ message: "2FA enabled successfully" });
  } catch (error) {
    console.error("Enable 2FA error:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to enable 2FA" });
  }
}

export async function disable2FA(
  request: Request,
  response: Response
): Promise<void> {
  const userId = request.user?.userId;

  if (!userId) {
    response
      .status(HTTP_Status.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
    return;
  }

  try {
    await userService.setTwoFactorSecret(userId, "");
    response
      .status(HTTP_Status.OK)
      .json({ message: "2FA disabled successfully" });
  } catch (error) {
    console.error("Disable 2FA error:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to disable 2FA" });
  }
}
