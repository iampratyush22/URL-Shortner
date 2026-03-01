// src/types/UrlData.ts
export interface UrlData {
    shortCode: string;
    longUrl: string;
    userId:string;
}
export interface TUrlRepo {
    findByShortCode(shortCode: string): Promise<UrlData | null>;
}