import mongoose from "mongoose";

export const connectToDb = async () => {
    try {
        const url = process.env.DB_URL;
        console.log('DB URL ::', url);
        if (!url) {
            throw Error('DB Url undefined');
        }
        await mongoose.connect(url, {
            dbName: 'url-shortner-url-generate-service',
        });
        console.log('Analytics Service connected to DB');
    } catch (error) {
        console.error('Error connecting to DB from Analytics Service', error);
    }
}
