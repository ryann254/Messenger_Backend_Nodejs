import mongoose from 'mongoose';
import Conversation, {
  IConversation,
  IConversationDoc,
} from '../mongodb/models/conversation';

/**
 * Create a conversation
 * @param {IConversation} conversationBody
 * @returns a Promise<any>(for now)
 * **/
export const createConversation = async (
  conversationBody: IConversation
): Promise<IConversationDoc | null> =>
  Conversation.create({
    name: conversationBody.name,
    members: conversationBody.members,
  });

/**
 * Get a conversation that both users belong to
 * @param userA id of the first user
 * @param userB id of the second user
 * @returns a conversation that they both belong to
 */
export const getConversation = async (
  userA: mongoose.Types.ObjectId,
  userB: mongoose.Types.ObjectId
): Promise<IConversationDoc | null> =>
  Conversation.findOne({
    members: {
      $all: [
        new mongoose.Types.ObjectId(userA),
        new mongoose.Types.ObjectId(userB),
      ],
    },
  });
