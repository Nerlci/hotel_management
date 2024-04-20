import express from "express";
import cors from "cors";
import { UserAvailablityResponse } from "shared";

const app = express();

app.use(cors()); // dev mode
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

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
