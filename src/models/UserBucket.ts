import mongoose, { Schema, Document } from 'mongoose';

export interface UserBucketDocument extends Document {
  userId: string;
  tokens: number;
  lastRefill: number;
  createdAt: number;
}

const UserBucketSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  tokens: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 10
  },
  lastRefill: {
    type: Number,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now
  }
});

export const UserBucketModel = mongoose.model<UserBucketDocument>('UserBucket', UserBucketSchema);