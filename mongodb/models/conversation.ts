import { Document } from 'mongodb';
import mongoose, { Mongoose, Types } from 'mongoose';
import { IUserDoc } from './user';
import { IMessageDoc } from './message';

const ConversationSchema = new mongoose.Schema<IConversationDoc>({
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

export interface IConversationDoc extends IConversation, Document {}

export type IConversationPopulated = IConversationDoc & {
  messages: Types.DocumentArray<IMessageDoc>;
  members: Types.DocumentArray<IUserDoc>;
};

const Conversation = mongoose.model<IConversationDoc>(
  'Conversation',
  ConversationSchema
);
export default Conversation;
