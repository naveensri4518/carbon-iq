import mongoose, { Schema, Document } from "mongoose";

export interface ISimulation extends Document {
  userId: mongoose.Types.ObjectId;
  currentLifestyle: {
    transport: string;
    diet: string;
    energy: string;
  };
  futureLifestyle: {
    transport: string;
    diet: string;
    energy: string;
  };
  carbonSaved: number;
  moneySaved: number;
  createdAt: Date;
}

const SimulationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  currentLifestyle: {
    transport: { type: String, required: true },
    diet: { type: String, required: true },
    energy: { type: String, required: true },
  },
  futureLifestyle: {
    transport: { type: String, required: true },
    diet: { type: String, required: true },
    energy: { type: String, required: true },
  },
  carbonSaved: { type: Number, required: true },
  moneySaved: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Simulation || mongoose.model<ISimulation>("Simulation", SimulationSchema);
