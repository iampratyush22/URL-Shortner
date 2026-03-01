import { app } from "./app";
import { connectToDb } from "./utils/db.utils";
import { connectZookeeper } from "./zookeeper/zkClient";

const PORT = process.env.PORT || 7000;

(async () => {
    try {
        await connectToDb();
        await connectZookeeper();

        app.listen(PORT, () => {
            console.log(`🚀 URL Shortener running on port ${PORT}`);
        });

    } catch (error) {
        console.log('Failed to start url generate service ', error);
    }

})();
