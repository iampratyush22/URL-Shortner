export const SERVICES = {
    AUTH: process.env.AUTH_SERVICE_URL!,
    SHORTENER: process.env.SHORTENER_SERVICE_URL!,
    REDIRECT: process.env.REDIRECT_SERVICE_URL!,
    CLIENT: process.env.CLIENT_SERVICE_URL!,
    ANALYTICS: process.env.ANALYTICS_SERVICE_URL!,
};

console.log('Urls ::', SERVICES);
