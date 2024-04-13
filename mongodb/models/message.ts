import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    media_url: {
      type: String,
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

const Message = mongoose.model('Message', MessageSchema);
