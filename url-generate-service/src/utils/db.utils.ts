import mongoose from "mongoose"

export const connectToDb = async () => {
    try {
        // console.log(...)
        await mongoose.connect(`${process.env.DB_URL}`, {
            dbName: 'url-shortner-url-generate-service',
        });
        // console.log(...)
        console.log('Database conneced succesfully');

    } catch (error) {
        // console.log(...)
        console.log('Error ::',error);
        throw new Error('Failed to connect to db');
    }
};