import "reflect-metadata";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import databaseConnection from "./db/databaseConnection.js";
import categoryRouter from "./routes/categoryRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/UserEntity";

// Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Declaration
dotenv.config();
const app = express();

// CORS Policies
app.use(
  cors({
    origin: ["http://localhost:5173", "https://future-insights.onrender.com"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Configuration Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Routes / APIs
app.use("/category", categoryRouter);
app.use("/course", courseRouter);
app.use("/user", userRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "future_insights",
  synchronize: true,
  entities: [UserEntity],
});

AppDataSource.initialize()
  .then(() => {
    console.log("connected to php my admin successfully");
  })
  .catch((error) => console.log("failed to connect to php my admin: ", error));

// Connect to server
app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`Server Running On Port: ${process.env.PORT}`);
  } else {
    console.log("Couldn't Connect To Server!");
    console.error(`Error: ${error}`);
  }
});
