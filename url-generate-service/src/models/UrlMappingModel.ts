import { Schema, model, Document } from "mongoose";

export interface UrlMappingDocument extends Document {
    id: number;           
    shortCode: string;    
    longUrl: string;
    userId?: string;
    createdAt: Date;
}

const UrlMappingSchema = new Schema<UrlMappingDocument>({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true, 
    },
    longUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const UrlMappingModel = model<UrlMappingDocument>(
    "UrlMapping",
    UrlMappingSchema
);
