import { Router } from "express";
import { UrlController } from "../controller/url.generation";
import { UrlGenerationService } from "../services/url.generation.service";
import { MongoDbRepo, UrlRepo } from "../repo/url.repo";

const router = Router();
const controller = new UrlController(new UrlGenerationService(new UrlRepo(new MongoDbRepo())));

// router.use((req, _res, next) => {
//     console.log("ROUTER HIT:", req.method, req.originalUrl);
//     next();
// });

router.post("/shorten", controller.shorten.bind(controller));
router.get("/urls", controller.getUrls.bind(controller));

export default router;
