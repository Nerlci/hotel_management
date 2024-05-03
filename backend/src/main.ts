import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {UserAvailablityResponse} from "shared";
import {apiRouter} from "./router/apiRouter";
import {initRoom} from "./service/roomService";
const app = express();

app.use(cors({credentials: true, preflightContinue: true, origin: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
	res.send("Hello, world!");
});

app.get("/echo", async (req, res) => {
	res.send(req.body);
});

app.use("/api", apiRouter);

app.listen(8080, () => {
	console.log("Server is running on http://localhost:8080");
});

// set TOTAL_ROOMS in .env file
initRoom();
