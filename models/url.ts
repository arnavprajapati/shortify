import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVisit {
  timestamp: number;
}

export interface IUrl extends Document {
  shortId: string;
  redirectUrl: string;
  count: number;
  visitHistory: IVisit[];
  createdAt: Date;
  updatedAt: Date;
}

const urlSchema = new Schema<IUrl>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    redirectUrl: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    visitHistory: [
      {
        timestamp: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Url: Model<IUrl> = mongoose.models.Url || mongoose.model<IUrl>('Url', urlSchema);
export default Url;
