import { app } from "./app";
import { connectToDb } from "./db/connect";
import { initConsumer } from "./kafka/consumer";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectToDb().then(() => {
    initConsumer().then(() => {
        app.listen(PORT, () => {
            console.log('Analytics service running on port', PORT);
        });
    }).catch(err => {
        console.error("Failed to connect Kafka consumer", err);
    });
}).catch(err => {
    console.error("Failed to connect to Database", err);
});
