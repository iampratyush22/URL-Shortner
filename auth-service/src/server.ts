import app from "./app";
import { connectToDb } from "./utils/db.utils";


const port = process.env.PORT || 4500;
if (!port) {
    throw new Error('PORT env not provided please check env');
}

connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running at port ${port}`);

    })
}).catch((error) => {
    console.log(error.message);
})
