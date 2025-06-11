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
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      response.status(HTTP_Status.BAD_REQUEST).json({
        error: "Password does not meet complexity requirements",
        details: passwordValidation.errors,
      });
      return;
    }

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

    if (!process.env.JWT_PROVISIONAL_SECRET) {
      response
        .status(HTTP_Status.INTERNAL_SERVER_ERROR)
        .json({ error: "JWT provisional secret is not configured" });
      return;
    }
    const provisionalToken = jwt.sign(
      {
        userId: newUser.user_id,
        username: newUser.username,
        twoFactorVerified: false,
        isHttpOnlyCookie: true,
      },
      process.env.JWT_PROVISIONAL_SECRET,
      { expiresIn: "1h" }
    );

    const frontendToken = jwt.sign(
      {
        userId: newUser.user_id,
        username: newUser.username,
        twoFactorVerified: false,
      },
      process.env.JWT_PROVISIONAL_SECRET,
      { expiresIn: "1h" }
    );

    response.cookie("provisionalToken", provisionalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    const { password_hash, two_factor_secret, ...userWithoutSensitiveData } =
      newUser;

    response.status(HTTP_Status.CREATED).json({
      message:
        "User registered successfully. Please complete 2FA setup to access your account.",
      user: userWithoutSensitiveData,
      token: frontendToken,
      requiresTwoFactorSetup: true,
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
      user.password_hash
    );
    if (!isPasswordValid) {
      response
        .status(HTTP_Status.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }
    const has2FA = !!user.two_factor_secret;

    if (has2FA) {
      const { token } = request.body;
      if (!token) {
        response.status(HTTP_Status.UNAUTHORIZED).json({
          error: "TOTP token required",
          requiresTotpToken: true,
        });

        return;
      }

      const isTokenValid = verifyTOTPToken(user.two_factor_secret, token);
      if (!isTokenValid) {
        response
          .status(HTTP_Status.UNAUTHORIZED)
          .json({ error: "Invalid TOTP token" });
        return;
      }

      if (!process.env.JWT_SECRET) {
        response
          .status(HTTP_Status.INTERNAL_SERVER_ERROR)
          .json({ error: "JWT secret is not configured" });
        return;
      }
      const tokenJwt = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          twoFactorVerified: true,
          isHttpOnlyCookie: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const frontendToken = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          twoFactorVerified: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      response.cookie("authToken", tokenJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      response.status(HTTP_Status.OK).json({
        message: "Login successful",
        token: frontendToken,
        user: {
          user_id: user.user_id,
          username: user.username,
          emailAddress: user.email_address,
          twoFactorEnabled: true,
        },
      });
    } else {
      if (!process.env.JWT_PROVISIONAL_SECRET) {
        response
          .status(HTTP_Status.INTERNAL_SERVER_ERROR)
          .json({ error: "JWT provisional secret is not configured" });
        return;
      }
      const provisionalToken = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          twoFactorVerified: false,
          isHttpOnlyCookie: true,
        },
        process.env.JWT_PROVISIONAL_SECRET,
        { expiresIn: "1h" }
      );

      const frontendProvisionalToken = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          twoFactorVerified: false,
        },
        process.env.JWT_PROVISIONAL_SECRET,
        { expiresIn: "1h" }
      );

      response.cookie("provisionalToken", provisionalToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      response.status(HTTP_Status.OK).json({
        message: "2FA setup required",
        token: frontendProvisionalToken,
        requiresTwoFactorSetup: true,
        user: {
          user_id: user.user_id,
          username: user.username,
          emailAddress: user.email_address,
          twoFactorEnabled: false,
        },
      });
    }
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

    if (!process.env.JWT_SECRET) {
      response
        .status(HTTP_Status.INTERNAL_SERVER_ERROR)
        .json({ error: "JWT secret is not configured" });
      return;
    }
    const fullToken = jwt.sign(
      {
        userId: request.user?.userId,
        username: request.user?.username,
        role: request.user?.role,
        twoFactorVerified: true,
        isHttpOnlyCookie: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const frontendToken = jwt.sign(
      {
        userId: request.user?.userId,
        username: request.user?.username,
        role: request.user?.role,
        twoFactorVerified: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    response.clearCookie("provisionalToken");
    response.cookie("authToken", fullToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    response.status(HTTP_Status.OK).json({
      message: "2FA enabled successfully",
      token: frontendToken,
    });
  } catch (error) {
    console.error("Enable 2FA error:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to enable 2FA" });
  }
}

export async function logout(
  _request: Request,
  response: Response
): Promise<void> {
  try {
    response.clearCookie("authToken");
    response.clearCookie("provisionalToken");

    response.status(HTTP_Status.OK).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to logout" });
  }
}
