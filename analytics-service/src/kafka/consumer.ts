import { Kafka } from "kafkajs";
import geoip from 'geoip-lite';
import { ClickTracking } from "../models/ClickTracking";

const kafka = new Kafka({
    clientId: 'analytics-service',
    brokers: [(process.env.KAFKA_BROKER || 'localhost:29092')]
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

export const initConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'url-clicks', fromBeginning: false });

    await consumer.run({
        eachBatch: async ({ batch }) => {
            const clicksToInsert = [];

            for (const message of batch.messages) {
                if (!message.value) continue;
                try {
                    const data = JSON.parse(message.value.toString());
                    const { shortCode, ip, userAgent, timestamp } = data;

                    let country = 'Unknown';
                    let city = 'Unknown';

                    // We try to resolve location if it's a valid IP
                    if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
                        const geo = geoip.lookup(ip);
                        if (geo) {
                            country = geo.country || 'Unknown';
                            city = geo.city || 'Unknown';
                        }
                    }

                    clicksToInsert.push({
                        shortCode,
                        ip,
                        country,
                        city,
                        userAgent,
                        timestamp: timestamp || new Date()
                    });
                } catch (error) {
                    console.error("Error processing kafka message in batch", error);
                }
            }

            if (clicksToInsert.length > 0) {
                try {
                    await ClickTracking.insertMany(clicksToInsert);
                    console.log(`[Kafka] Processed batch of ${clicksToInsert.length} clicks`);
                } catch (error) {
                    console.error("Error saving batch to MongoDB", error);
                }
            }
        },
    });
    console.log("Kafka consumer connected and listening to 'url-clicks'");
}
