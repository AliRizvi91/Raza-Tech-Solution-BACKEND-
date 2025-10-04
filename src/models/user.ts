import mongoose, { Schema, Document, Model, ObjectId  } from "mongoose";
import bcrypt from "bcryptjs";

// Define User interface (what fields a User has)
export interface IUser extends Document {
  _id: ObjectId;   // 👈 important
  image?: string;
  username: string;
  email: string;
  password: string;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

// User Schema
const UserSchema: Schema<IUser> = new Schema<IUser>({
  image: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    trim: true, // Removes whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Store emails in lowercase
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters"],
  },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update updatedAt before saving
UserSchema.pre<IUser>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Middleware to hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

// Create model
export const User_Model: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
