import mongoose from 'mongoose';
import Conversation, {
  IConversation,
  IConversationDoc,
  IConversationPopulated,
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
    tag: conversationBody.tag,
    description: conversationBody.description,
    members: conversationBody.members,
  });

/**
 * Get a conversation using the provided conversationId
 * @param conversationId id belonging to a specific conversation
 * @returns a conversation with the specified id
 */
export const getConversation = async (
  conversationId: mongoose.Types.ObjectId
): Promise<IConversationDoc | null> =>
  Conversation.findById(conversationId).populate('members');

/**
 * Get a conversation that both users belong to
 * @param userA id of the first user
 * @param userB id of the second user
 * @returns a conversation that they both belong to
 */
export const getConversationWithUsers = async (
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

/**
 * Get the messages for every room that a user is in.
 * @param user logged in user
 * @returns messages of the logged in user for every room where they are members
 */
export const queryConversationsWithMessages = async (
  userId: string
): Promise<IConversationPopulated[]> =>
  Conversation.find({}).populate('messages').populate('members');

/**
 * Update a conversation
 * @param conversationId id belonging to a specific conversation
 * @param conversationBody new conversation body
 * @returns a conversation with the specified id
 */
export const updateConversation = async (
  conversationId: string,
  conversationBody: Partial<IConversationDoc>
): Promise<IConversationDoc | null> =>
  Conversation.findByIdAndUpdate(
    conversationId,
    {
      name: conversationBody.name,
      tag: conversationBody.tag,
      description: conversationBody.description,
      members: conversationBody.members,
    },
    {
      new: true,
    }
  )
    .populate('messages')
    .populate('members');
