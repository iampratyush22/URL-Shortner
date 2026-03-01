// repositories/UrlRepo.ts
import { TUrlRepo } from "../types/urlData";
import { UrlData } from "../types/urlData";
import { RedisManager } from "../redis/redisManager";

export class UrlRepo implements TUrlRepo {
    private redis = RedisManager.getInstance();

    constructor(private db: TUrlRepo) { }

    async findByShortCode(shortCode: string): Promise<UrlData | null> {
        const cacheKey = `short:${shortCode}`;

        const cached = await this.redis.get(cacheKey);
        if (cached) {
            console.log('Cace hit');
            return JSON.parse(cached) as UrlData;
        }
        console.log('Cace miss');

        const data = await this.db.findByShortCode(shortCode);
        if (!data) return null;

        await this.redis.set(
            cacheKey,
            JSON.stringify(data)
        );

        return data;
    }
}
