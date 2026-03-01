import { Router } from "express";
import { ClickTracking } from "../models/ClickTracking";

const router = Router();

router.get('/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;

        const totalClicks = await ClickTracking.countDocuments({ shortCode });

        // Use any limit for recent clicks
        const recentClicks = await ClickTracking.find({ shortCode })
            .sort({ timestamp: -1 })
            .limit(10)
            .select('ip country city userAgent timestamp -_id');

        const countryStats = await ClickTracking.aggregate([
            { $match: { shortCode } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            shortCode,
            totalClicks,
            countryStats: countryStats.map(stat => ({ country: stat._id, count: stat.count })),
            recentClicks
        });

    } catch (error) {
        console.error("Error fetching analytics", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
