import zookeeper from "node-zookeeper-client";
import { zkClient } from "../zookeeper/zkClient";
import { encodeBase62 } from "../utils/base62";
import { TUrlRepo } from "../repo/url.repo";
import { UrlMappingDocument } from "../models/UrlMappingModel";
import { UrlData } from "../types/url.type";
import { RedisManager } from "../redis/redis.manager";

const ZNODE_PATH = "/url-shortener/ids/id-";
export interface TUrlGenerationService {
    generateShortUrl(longUrl: string, userId: string): Promise<string>
    getUserUrls(userId: string, page: number, limit: number): Promise<{ urls: UrlData[], totalPages: number, currentPage: number, totalCount: number }>
}

export class UrlGenerationService implements TUrlGenerationService {
    constructor(private UrlRepo: TUrlRepo) { }

    async getUserUrls(userId: string, page: number, limit: number): Promise<{ urls: UrlData[], totalPages: number, currentPage: number, totalCount: number }> {
        const skip = (page - 1) * limit;
        const [urls, totalCount] = await Promise.all([
            this.UrlRepo.findByUserId(userId, skip, limit),
            this.UrlRepo.countByUserId(userId)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            urls,
            totalPages,
            currentPage: page,
            totalCount
        };
    }

    async generateShortUrl(longUrl: string, userId: string): Promise<string> {

        zkClient.mkdirp('/url-shortener/ids', (error) => {
            if (error) {
                console.log('Failed to create path');
            }
            console.log('Znode ensured ', ZNODE_PATH);
        })

        const path = await new Promise((resolve, reject) => {
            zkClient.create(
                ZNODE_PATH,
                zookeeper.CreateMode.PERSISTENT_SEQUENTIAL,
                (error, path) => {
                    if (error) {
                        return reject(error);
                    }


                    resolve(path);
                }
            );
        });
        const id = this.extractId(path as string);
        const shortCode = encodeBase62(id);

        //save to db
        const data: UrlData = {
            id,
            shortCode,
            longUrl,
            userId,
        }
        //save to db
        await this.UrlRepo.save(data);

        await RedisManager.getInstance().set(`short:${shortCode}`, JSON.stringify({ longUrl, userId }))

        return shortCode;

    }

    private extractId(path: string): number {
        const parts = path.split("-");
        return parseInt(parts[parts.length - 1], 10);
    }
}
