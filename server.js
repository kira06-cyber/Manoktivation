/* eslint-env node */
/* global process */
import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import userRoutes from "./routes/user.js";
import taskRoutes from "./routes/task.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`📡 Incoming Request: [${req.method}] ${req.url}`);
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (req, res) => res.send("Backend is working!"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
