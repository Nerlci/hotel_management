import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserAvailablityResponse } from "shared";
import { apiRouter } from "./router/apiRouter";

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

app.get("/api/room/availability", async (req, res) => {
  const disabledDays: Date[] = [
    new Date(),
    new Date(2024, 4, 3),
    new Date(2024, 4, 5),
  ];
  const response = UserAvailablityResponse.parse({
    error: {
      msg: "",
    },
    code: "200",
    payload: {
      unavailableDates: disabledDays.map((d) => d.toISOString()),
    },
  });
  res.json(response);
});

app.use("/api", apiRouter);

app.listen(58080, () => {
  console.log("Server is running on http://localhost:8080");
});
