import { Request, Response } from "express";
import { TUrlGenerationService, UrlGenerationService } from "../services/url.generation.service";



export class UrlController {
    constructor(private urlGenerationService: TUrlGenerationService) { }
    async shorten(req: Request, res: Response) {
        try {
            const { longUrl } = req.body;
            const userId = req.headers['x-user-id'] as string || "";


            if (!longUrl) {
                return res.status(400).json({ message: "longUrl required" });
            }

            const shortCode = await this.urlGenerationService.generateShortUrl(longUrl, userId);


            res.status(201).json({
                shortUrl: shortCode,
            });
        } catch (err) {
            console.log('Error ::', err);
            res.status(500).json({ message: "Failed to generate URL" });
        }
    }

    async getUrls(req: Request, res: Response) {
        try {
            const userId = req.headers['x-user-id'] as string;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.urlGenerationService.getUserUrls(userId, page, limit);

            res.status(200).json(result);
        } catch (err) {
            console.error('Error fetching URLs ::', err);
            res.status(500).json({ message: "Failed to fetch URLs" });
        }
    }
}
