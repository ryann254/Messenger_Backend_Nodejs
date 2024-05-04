import mongoose, { Mongoose, Types } from 'mongoose';

const ConversationSchema = new mongoose.Schema<IConversation>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true,
      },
    ],
    index: true,
  },
});

export interface IConversation {
  name: string;
  messages?: Types.DocumentArray<mongoose.Types.ObjectId>;
  members: Types.DocumentArray<mongoose.Types.ObjectId>;
}

const Conversation = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
export default Conversation;
