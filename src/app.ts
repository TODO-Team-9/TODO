import express from "express";
import path from "path";
import dotenv from "dotenv";

import apiRouter from "./routes/apiRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "../public/static")));

app.use("/api", apiRouter);

app.get("/{*any}", (_request, response) => {
  response.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
