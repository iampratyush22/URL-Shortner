import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/services"
import { authMiddleware } from "../middleware/auth.middleware";
import { Express } from "express-serve-static-core";
import { RequestHandler } from "express";

interface TRouteConfig {
    route?: string,
    handler: RequestHandler,
}

const routeConfig: Array<TRouteConfig> = [
    {
        route: '/auth',
        handler: createProxyMiddleware({
            target: SERVICES.AUTH,
            changeOrigin: true,
        })
    },
    {
        route: '/shorten',
        handler: createProxyMiddleware({
            target: SERVICES.SHORTENER,
            changeOrigin: true,
        })
    },
    {
        route: '/r',
        handler: createProxyMiddleware({
            target: SERVICES.REDIRECT,
            changeOrigin: true,
        })
    },
    {
        route: '/analytic',
        handler: createProxyMiddleware({
            target: SERVICES.ANALYTICS,
            changeOrigin: true,
        })
    },
    {
        handler: createProxyMiddleware({
            target: SERVICES.CLIENT,
            changeOrigin: true,
        })
    },
]


export function setupRoutes(app: Express) {

    routeConfig.forEach(({ route, handler }) => {
        route ? app.use(route, handler) : app.use(handler);
    });
}
