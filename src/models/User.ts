import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  userId: string;
  email: string;
  name: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);