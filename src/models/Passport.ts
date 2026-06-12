import mongoose, { Schema, Document } from "mongoose";

export interface IPassport extends Document {
  userId: mongoose.Types.ObjectId;
  achievements: string[];
  carbonSaved: number;
  treesEquivalent: number;
  climateRank: string;
  updatedAt: Date;
}

const PassportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  achievements: [{ type: String }],
  carbonSaved: { type: Number, required: true },
  treesEquivalent: { type: Number, required: true },
  climateRank: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Passport || mongoose.model<IPassport>("Passport", PassportSchema);
