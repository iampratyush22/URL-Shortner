// src/controllers/RedirectController.ts
import { Request, Response } from "express";
import { MongoDbRepo } from "../db/Mongorepo";
import { UrlRepo } from "../db/UrlRepository";
import { sendMessage } from "../kafka/producer";

export class RedirectController {
    private urlRepo;

    constructor() {
        const mongoRepo = new MongoDbRepo();
        this.urlRepo = new UrlRepo(mongoRepo); // Proxy injected
    }

    async redirect(req: Request, res: Response) {
        const { shortCode } = req.params

        if (!shortCode || typeof shortCode != 'string') {
            return res.status(400).json({ message: "Invalid short code" });
        }

        const urlData = await this.urlRepo.findByShortCode(shortCode);
        console.log('Url data ::', urlData);

        if (!urlData) {
            return res.status(404).json({ message: "URL not found" });
        }

        // Send click event to Kafka asynchronously
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        if (Array.isArray(ip)) {
            ip = ip[0];
        }
        const userAgent = req.headers['user-agent'] || 'unknown';

        sendMessage('url-clicks', {
            shortCode,
            ip,
            userAgent,
            timestamp: new Date().toISOString()
        }).catch(err => console.error('Failed to send click event to Kafka', err));

        return res.redirect(302, urlData.longUrl);
    }
}
