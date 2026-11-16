
import express from "express";
import cors from "cors";
import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "./users.js";
import mongoose from "mongoose";
import projectsRouter from "./routes/projects.js";
import storiesRouter from "./routes/stories.js";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Brakuje sekretów JWT w pliku .env");
}

app.get("/", (_req, res) => {
  res.json({ message: "ManagMe API działa!" });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { login, password } = req.body ?? {};

    if (
      typeof login !== "string" ||
      typeof password !== "string" ||
      !login.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Login i hasło są wymagane",
      });
      return;
    }

    const user = users.find((u) => u.login === login);

    if (!user) {
      res.status(401).json({
        message: "Nieprawidłowy login lub hasło",
      });
      return;
    }

    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      res.status(401).json({
        message: "Nieprawidłowy login lub hasło",
      });
      return;
    }

    const token = jwt.sign(
      { role: user.role },
      JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { type: "refresh" },
      REFRESH_TOKEN_SECRET,
      {
        subject: user.id,
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Logowanie zakończone sukcesem",
      token,
      refreshToken,
      user: {
        id: user.id,
        login: user.login,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Błąd logowania:", error);

    res.status(500).json({
      message: "Wewnętrzny błąd serwera",
    });
  }
});



app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body ?? {};

  if (typeof refreshToken !== "string" || !refreshToken) {
    res.status(400).json({
      message: "Refresh token jest wymagany",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    );

    if (
      typeof decoded === "string" ||
      decoded.type !== "refresh" ||
      typeof decoded.sub !== "string"
    ) {
      res.status(401).json({
        message: "Nieprawidłowy refresh token",
      });
      return;
    }

    const user = users.find((u) => u.id === decoded.sub);

    if (!user) {
      res.status(401).json({
        message: "Użytkownik nie istnieje",
      });
      return;
    }

    const newToken = jwt.sign(
      { role: user.role },
      JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "15m",
      }
    );

    res.json({
      message: "Token został odświeżony",
      token: newToken,
    });
  } catch {
    res.status(401).json({
      message: "Refresh token jest nieprawidłowy lub wygasł",
    });
  }
});

app.use("/api/projects", projectsRouter);

async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("Brakuje MONGO_URI w pliku .env");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Połączono z MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Backend działa na http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB:", error);
    process.exit(1);
  }
}

app.use("/api/stories", storiesRouter);
app.use("/api/tasks", tasksRouter);

startServer();
