import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HTTP_Status } from "../enums/HTTP_Status";
import { SystemRoles } from "../constants/db.constants";

const userService = new UserService();

export async function createUser(req: Request, res: Response): Promise<void> {
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
    const { passwordHash, ...userWithoutSensitiveData } = newUser;

    res.status(HTTP_Status.CREATED).json({
      message: "User created successfully",
      user: userWithoutSensitiveData
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to create user" });
  }
}

export async function deactivateUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (req.user?.role !== SystemRoles.ACCESS_ADMINISTATOR) {
      res.status(HTTP_Status.FORBIDDEN).json({ error: "Access denied" });
      return;
    }

    const user = await userService.findById(userId);
    if (!user) {
      res.status(HTTP_Status.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    await userService.deactivateUser(userId);
    res.status(HTTP_Status.OK).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to deactivate user" });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);

    if (req.user?.userId !== userId && req.user?.role !== SystemRoles.ACCESS_ADMINISTATOR) {
      res.status(HTTP_Status.FORBIDDEN).json({ error: "Access denied" });
      return;
    }

    const user = await userService.findById(userId);
    if (!user) {
      res.status(HTTP_Status.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    const { passwordHash, ...userWithoutSensitiveData } = user;
    res.status(HTTP_Status.OK).json({ user: userWithoutSensitiveData });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch user" });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    if (req.user?.role !== SystemRoles.ACCESS_ADMINISTATOR) {
      res.status(HTTP_Status.FORBIDDEN).json({ error: "Access denied" });
      return;
    }

    const users = await userService.getAllUsers();
    const usersWithoutSensitiveData = users.map(user => {
      const { passwordHash, ...userWithoutSensitiveData } = user;
      return userWithoutSensitiveData;
    });

    res.status(HTTP_Status.OK).json({ users: usersWithoutSensitiveData });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(HTTP_Status.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch users" });
  }
}
