import { Router, RequestHandler } from "express";
import {
  authenticate,
  isAccessAdministrator,
} from "../middleware/auth.middleware";
import UserModel from "../models/user.model";

const router = Router();

router.get("/", authenticate, isAccessAdministrator, ((req, res) => {
  res.json({ message: "This would return all users (admin only)" });
}) as RequestHandler);

router.get("/:id", authenticate, ((req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (req.user?.userId !== userId && req.user?.role !== 2) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { passwordHash, ...userWithoutSensitiveData } = user;

      res.json({ user: userWithoutSensitiveData });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    });
}) as RequestHandler);

export default router;
