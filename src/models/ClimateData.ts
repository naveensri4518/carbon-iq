import mongoose, { Schema, Document } from "mongoose";

export interface IClimateData extends Document {
  userId: mongoose.Types.ObjectId;
  transportEmission: number;
  foodEmission: number;
  electricityEmission: number;
  shoppingEmission: number;
  totalEmission: number;
  futurePredictions: {
    sixMonths: number;
    oneYear: number;
    fiveYears: number;
  };
  aiInsight: string;
  createdAt: Date;
}

const ClimateDataSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  transportEmission: { type: Number, required: true },
  foodEmission: { type: Number, required: true },
  electricityEmission: { type: Number, required: true },
  shoppingEmission: { type: Number, required: true },
  totalEmission: { type: Number, required: true },
  futurePredictions: {
    sixMonths: { type: Number, required: true },
    oneYear: { type: Number, required: true },
    fiveYears: { type: Number, required: true },
  },
  aiInsight: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ClimateData || mongoose.model<IClimateData>("ClimateData", ClimateDataSchema);
