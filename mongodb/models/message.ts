import { Document } from 'mongodb';
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema<IMessageDoc>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    media_url: {
      type: String,
    },
    sent: {
      type: Boolean,
      default: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  },
  {
    timestamps: true,
  }
);

export interface IMessage {
  sender: mongoose.Schema.Types.ObjectId;
  text: string;
  media_url?: string;
  sent: boolean;
  conversation: mongoose.Schema.Types.ObjectId;
}

export interface IMessageDoc extends IMessage, Document {}

const Message = mongoose.model<IMessageDoc>('Message', MessageSchema);

export default Message;
