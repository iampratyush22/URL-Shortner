import Redis from "ioredis";

export class RedisManager {
    private static instance: RedisManager;
    private client: Redis;

    private constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD,
            lazyConnect: true,
        });

        this.client.on("connect", () => {
            console.log("✅ Redis connected");
        });

        this.client.on("error", (err) => {
            console.error("❌ Redis error", err);
        });
    }

    /** Singleton instance */
    static getInstance(): RedisManager {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    async connect(): Promise<void> {
        if (this.client.status === "ready") return;
        await this.client.connect();
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number
    ): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, "EX", ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }
}
