import { app } from "./app";
import { connectToDb } from "./db/connect";
import { initProducer } from "./kafka/producer";

const PORT = process.env.PORT || 8000;

connectToDb().then(() => {
    initProducer().then(() => {
        app.listen(PORT, () => {
            console.log('Redirect service running ', PORT);
        })
    }).catch(err => {
        console.error("Failed to connect to Kafka", err);
    });
})