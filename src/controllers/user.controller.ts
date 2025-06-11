import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { validateUsername } from "../utils/username.utils";
import { HTTP_Status } from "../enums/HTTP_Status";
import { Role } from "../enums/Role";

const userService = new UserService();

export async function createUser(
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

    const newUser = await userService.createUser({
      username,
      password,
    });
    const { password_hash, two_factor_secret, ...userWithoutSensitiveData } =
      newUser;

    response.status(HTTP_Status.CREATED).json({
      message: "User created successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create user" });
  }
}

export async function deactivateUser(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const userId = parseInt(request.params.id, 10);

    if (request.user?.role !== Role.System.ACCESS_ADMINISTRATOR) {
      response.status(HTTP_Status.FORBIDDEN).json({ error: "Access denied" });
      return;
    }

    const user = await userService.findById(userId);
    if (!user) {
      response.status(HTTP_Status.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    await userService.deactivateUser(userId);
    response
      .status(HTTP_Status.OK)
      .json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to deactivate user" });
  }
}

export async function getUserById(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const userId = parseInt(request.params.id, 10);

    // if (
    //   request.user?.userId !== userId &&
    //   request.user?.role !== Role.System.ACCESS_ADMINISTRATOR
    // ) {
    //   response.status(HTTP_Status.FORBIDDEN).json({ error: "Access denied" });
    //   return;
    // }

    const user = await userService.findById(userId);
    if (!user) {
      response.status(HTTP_Status.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    const { password_hash, two_factor_secret, ...userWithoutSensitiveData } =
      user;
    response.status(HTTP_Status.OK).json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error("Error fetching user:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch user" });
  }
}

export async function getAllUsers(
  request: Request,
  response: Response
): Promise<void> {
  try {
    if (request.user?.role !== Role.System.ACCESS_ADMINISTRATOR) {
      response.status(HTTP_Status.FORBIDDEN).json({ error: "Access denied" });
      return;
    }

    const users = await userService.getAllUsers();
    const usersWithoutSensitiveData = users.map((user) => {
      const { password_hash, two_factor_secret, ...userWithoutSensitiveData } =
        user;
      return userWithoutSensitiveData;
    });

    response.status(HTTP_Status.OK).json({ users: usersWithoutSensitiveData });
  } catch (error) {
    console.error("Error fetching users:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch users" });
  }
}

export async function getUserJoinRequests(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const userId = Number(request.params.userId);

    if (!userId || isNaN(userId)) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "Valid user ID is required" });
      return;
    }

    const requests = await userService.getUserJoinRequests(userId);
    response.status(HTTP_Status.OK).json(requests);
  } catch (error) {
    console.error("Error fetching user join requests:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch join requests" });
  }
}

export async function getUserTeams(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const userId = Number(request.params.userId);

    if (!userId || isNaN(userId)) {
      response
        .status(HTTP_Status.BAD_REQUEST)
        .json({ error: "Valid user ID is required" });
      return;
    }

    const teams = await userService.getUserTeams(userId);
    response.status(HTTP_Status.OK).json(teams);
  } catch (error) {
    console.error("Error fetching user teams:", error);
    response
      .status(HTTP_Status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch teams" });
  }
}
