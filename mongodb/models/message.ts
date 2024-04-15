import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    // TODO: Change this to reference a real user.
    sender: {
      type: String,
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
  sender: string;
  text: string;
  media_url?: string;
  sent: boolean;
  conversation: mongoose.Schema.Types.ObjectId;
}

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
