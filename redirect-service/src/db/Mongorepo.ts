// repositories/MongoDbRepo.ts
import { UrlMappingModel } from "../models/UrlMappingModel";
import { UrlData } from "../types/urlData";
import { TUrlRepo } from "../types/urlData";

export class MongoDbRepo implements TUrlRepo {
    async findByShortCode(shortCode: string): Promise<UrlData | null> {
        const doc = await UrlMappingModel.findOne({ shortCode }).lean();

        if (!doc) return null;

        return {
            shortCode: doc.shortCode,
            longUrl: doc.longUrl,
            userId: doc.userId as string,
        };
    }
}
