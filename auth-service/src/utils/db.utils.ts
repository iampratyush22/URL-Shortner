import mongoose from "mongoose"

export const connectToDb = async () => {
    try {
        // console.log(...)
        await mongoose.connect(`${process.env.DB_URL}`, {
            dbName: 'url-shortner-auth-service',
        });
        // console.log(...)
        console.log('Database conneceted ');

    } catch (error) {
        // console.log(...)
        throw new Error('Failed to connect to db');
    }
};