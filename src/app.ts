import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import corsMiddleware from "./middleware/cors.middleware";

const app = express();
const PORT = process.env.PORT ?? 3000;

// CORS middleware
app.use(corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// app.get("/{*any}", (_request, response) => {
//   response.sendFile(path.join(__dirname, "../public/index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
