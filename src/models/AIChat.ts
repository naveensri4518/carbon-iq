import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "model" | "system";
  content: string;
  timestamp: Date;
}

export interface IAIChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  updatedAt: Date;
}

const MessageSchema = new Schema({
  role: { type: String, enum: ["user", "model", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AIChatSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.AIChat || mongoose.model<IAIChat>("AIChat", AIChatSchema);
