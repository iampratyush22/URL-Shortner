import { Router } from "express";
import { RedirectController } from "../controller/redirect.controller";

const router = Router();
const controller = new RedirectController();

router.use((req, _res, next) => {
    console.log("ROUTER HIT:", req.method, req.originalUrl);
    next();
});

router.get("/:shortCode", controller.redirect.bind(controller));

export default router;
