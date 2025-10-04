import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { logger } from '../config/logger.config';


export const connect = async (): Promise<void> => {
  try {
    if (!process.env.Mongo_DB) {
      throw new Error('MongoDB connection string not defined in environment variables');
    }
    
    await mongoose.connect(process.env.Mongo_DB, {
      serverSelectionTimeoutMS: 30000, // Increased from 5s to 30s
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10
    });
    
    logger.info('Database connected successfully');
  } catch (error) {
  if (error instanceof Error) {
    logger.error(error); // Pass the entire Error object
  } else {
    logger.error(new Error('Unknown database connection error'));
  }
  throw error;
}
};

// Mongo_DB