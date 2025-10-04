import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for LevelInfo document
export interface ILevelInfo extends Document {
  name: string;
  description: string;
  Pages: number;
  functionalities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const LevelInfoSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  Pages: {
    type: Number,
    required: true,
  },
  functionalities: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
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
LevelInfoSchema.pre<ILevelInfo>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create & export model
const LevelInfoModel: Model<ILevelInfo> =
  mongoose.models.LevelInfo ||
  mongoose.model<ILevelInfo>('LevelInfo', LevelInfoSchema);

export default LevelInfoModel;
