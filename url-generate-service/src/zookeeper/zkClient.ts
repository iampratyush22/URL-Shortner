import zookeeper from "node-zookeeper-client";

const ZK_CONNECTION = process.env.ZK_CONNECTION || "localhost:2181";

export const zkClient = zookeeper.createClient(ZK_CONNECTION, {
    sessionTimeout: 30000,
    spinDelay: 1000,
    retries: 5,
});

export const connectZookeeper = (): Promise<void> => {
    return new Promise((resolve, reject) => {

        // 🔹 When connection is established
        zkClient.once("connected", () => {
            console.log("✅ ZooKeeper connected");
            resolve();
        });

        // 🔹 Connection state changes
        zkClient.on("state", (state) => {
            console.log("📡 ZooKeeper state:", state.toString());
        });

        // 🔹 Session expiration
        zkClient.on("expired", () => {
            console.error("⚠️ ZooKeeper session expired");
        });

        // 🔹 Authentication failure
        zkClient.on("authenticationFailed", () => {
            console.error("❌ ZooKeeper authentication failed");
        });

        // 🔹 Any generic error
        // zkClient.on("error", (err:any) => {
        //     console.error("❌ ZooKeeper error:", err.message);
        //     reject(err);
        // });

        console.log("🔌 Connecting to ZooKeeper at", ZK_CONNECTION);
        zkClient.connect();
    });
};
