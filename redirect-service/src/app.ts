import express from "express";
import dotenv from "dotenv";
import router from "./routes/route";
dotenv.config();

export const app = express();

app.use(express.json());

app.use((req, _res, next) => {
    console.log("REDIRECT HIT:", req.method, req.originalUrl);
    next();
});

app.use((req, _res, next) => {
    console.log("HEADERS:", req.headers["content-type"]);
    next();
});


app.use('/ping', (req, res) => res.status(200).send('pong'));
app.use(router);

app.use((req, res) => {
    return res.status(200).send('Not found redirect service');
})