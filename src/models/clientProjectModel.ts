import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for ClientProject document
export interface IClientProject extends Document {
    name: string;
    type: string;
    year: string;
    link: string;
    createdAt: Date;
    updatedAt: Date;
}

// ClientProject Schema
const ClientProjectSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        trim: true
    },
    link: {
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
ClientProjectSchema.pre<IClientProject>('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Create and export model
const ClientProjectModel: Model<IClientProject> =
    mongoose.models.ClientProject || mongoose.model<IClientProject>('ClientProject', ClientProjectSchema);

export default ClientProjectModel;
