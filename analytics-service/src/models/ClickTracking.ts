import mongoose, { Schema, Document } from 'mongoose';

export interface IClickTracking extends Document {
    shortCode: string;
    ip: string;
    country: string;
    city: string;
    userAgent: string;
    timestamp: Date;
}

const ClickTrackingSchema: Schema = new Schema({
    shortCode: { type: String, required: true, index: true },
    ip: { type: String, required: true },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    userAgent: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const ClickTracking = mongoose.model<IClickTracking>('ClickTracking', ClickTrackingSchema);
