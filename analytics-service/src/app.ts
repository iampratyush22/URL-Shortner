import express from "express";
import cors from "cors";
import analyticsRoutes from "./routes/analytics.route";

export const app = express();


console.log('Request come at analytics service');
app.use(express.json());
app.use(cors());

app.get('/ping', (req, res) => res.status(200).send('analytics pong'));

app.use('/', analyticsRoutes);
