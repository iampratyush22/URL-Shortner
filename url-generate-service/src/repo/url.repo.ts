import { UrlMappingModel } from "../models/UrlMappingModel";
import { UrlData } from "../types/url.type";





export interface TUrlRepo {
    save(data: UrlData): Promise<void>
    findByUserId(userId: string, skip: number, limit: number): Promise<UrlData[]>
    countByUserId(userId: string): Promise<number>
}



export class MongoDbRepo implements TUrlRepo {
    async save(data: UrlData): Promise<void> {
        await UrlMappingModel.create(data);
    }

    async findByUserId(userId: string, skip: number, limit: number): Promise<UrlData[]> {
        return UrlMappingModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    async countByUserId(userId: string): Promise<number> {
        return UrlMappingModel.countDocuments({ userId });
    }
}

export class UrlRepo implements TUrlRepo {
    constructor(private db: TUrlRepo) { }
    async save(data: UrlData): Promise<void> {
        await this.db.save(data)
    }

    async findByUserId(userId: string, skip: number, limit: number): Promise<UrlData[]> {
        return this.db.findByUserId(userId, skip, limit);
    }

    async countByUserId(userId: string): Promise<number> {
        return this.db.countByUserId(userId);
    }
}