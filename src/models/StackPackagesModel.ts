import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for StackPackages document
export interface IStackPackages extends Document {
  name: string;
  column1: string[];
  column2: string[];
  column3: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const StackPackagesSchema: Schema = new Schema({
  name: {
    type: String, // array of strings
    required: true,
  },
  column1: {
    type: [String], // array of strings
    required: true,
  },
  column2: {
    type: [String],
    required: true,
  },
  column3: {
    type: [String],
    required: true,
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

// Auto-update `updatedAt` before save
StackPackagesSchema.pre<IStackPackages>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create & export model
const StackPackagesModel: Model<IStackPackages> =
  mongoose.models.StackPackages ||
  mongoose.model<IStackPackages>('StackPackages', StackPackagesSchema);

export default StackPackagesModel;
