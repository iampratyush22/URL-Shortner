import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
    clientId: 'redirect-service',
    brokers: [(process.env.KAFKA_BROKER || 'localhost:29092')]
});

let producer: Producer | null = null;

export const initProducer = async () => {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
        console.log("Kafka producer connected");
    }
    return producer;
}

export const sendMessage = async (topic: string, message: any) => {
    try {
        const prod = await initProducer();
        await prod.send({
            topic,
            messages: [
                { value: JSON.stringify(message) }
            ],
        });
    } catch (error) {
        console.error("Error sending message to Kafka", error);
    }
}
