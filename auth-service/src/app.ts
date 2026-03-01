import express from "express";
import 'dotenv/config';
import cors from "cors";
import { userRouter } from "./user/user.route";
import bodyParser from "body-parser";

const app = express();

app.use((req, _res, next) => {
    console.log("AUTH HIT:", req.method, req.originalUrl);
    next();
});

app.use((req, _res, next) => {
    console.log("HEADERS:", req.headers["content-type"]);
    next();
});



// app.use(express.raw({ type: 'application/json' }));
app.use(bodyParser.json());
app.use(cors());




app.get('/ping', (req, res) => {
    res.status(200).send('pong');
})


app.use('/api/v1/user', userRouter);
app.use((req, res) => res.status(404).send("Not found auth service"));




export default app;