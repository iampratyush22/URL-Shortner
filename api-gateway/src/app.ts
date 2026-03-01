import "dotenv/config";
import express from "express";
import { setupRoutes } from "./routes/proxy.route";
import cors from "cors";

export const app = express();

app.use((req, _res, next) => {
    console.log("GATEWAY:", req.method, req.originalUrl);
    next();
});

app.use(cors())

app.get('/ping', (req, res) => res.status(200).send('pong'))

setupRoutes(app);
