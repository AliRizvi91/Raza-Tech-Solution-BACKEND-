import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for OptimizationInfo document
export interface IOptimizationInfo extends Document {
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema
const OptimizationInfoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-update `updatedAt` before save
OptimizationInfoSchema.pre<IOptimizationInfo>('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Create & export model
const OptimizationInfoModel: Model<IOptimizationInfo> =
    mongoose.models.OptimizationInfo || mongoose.model<IOptimizationInfo>('OptimizationInfo', OptimizationInfoSchema);

export default OptimizationInfoModel;
