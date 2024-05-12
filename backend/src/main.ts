import express from "express";

import http from "http";
import https from "https";
import fs from "fs";

import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./router/apiRouter";
import { initRoom } from "./service/roomService";
const app = express();

app.use(cors({ credentials: true, preflightContinue: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Hello, world!");
});

app.get("/echo", async (req, res) => {
  res.send(req.body);
});

app.use("/api", apiRouter);

const httpServer = http.createServer(app);
httpServer.listen(8080, () => {
  console.log("HTTP Server is running on http://localhost:8080");
});

const options = {
  key: fs.readFileSync("certs/server.key"),
  cert: fs.readFileSync("certs/server.crt"),
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(8443, () => {
  console.log("HTTPS Server is running on https://localhost:8443");
});

// set TOTAL_ROOMS in .env file
initRoom();
