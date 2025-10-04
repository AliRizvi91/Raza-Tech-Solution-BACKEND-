import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for FunctionalityInfo document
export interface IFunctionalityInfo extends Document {
  title: string;
  description: string;
  icon: string; // store icon name (e.g., "FiFileText")
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const FunctionalityInfoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true, // e.g., "FiFileText"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update updatedAt before save
FunctionalityInfoSchema.pre<IFunctionalityInfo>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create & export model
const FunctionalityInfoModel: Model<IFunctionalityInfo> =
  mongoose.models.FunctionalityInfo ||
  mongoose.model<IFunctionalityInfo>('FunctionalityInfo', FunctionalityInfoSchema);

export default FunctionalityInfoModel;
