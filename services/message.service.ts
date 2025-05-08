import mongoose from 'mongoose';
import Message, {
  IMessage,
  IMessageDoc,
  MessageData,
} from '../mongodb/models/message';
import { getConversation } from './conversation.service';
import { IUserDoc } from '../mongodb/models/user';

/**
 * Create a message
 * @param {IMessage} messageBody
 * @param {IUserDoc} user logged in user
 * @returns {Promise<IMessageDoc>}
 */
export const createMessage = async (
  { recipientId, conversationId, ...params }: MessageData,
  user: IUserDoc
): Promise<IMessageDoc> => {
  let conversation;

  if (conversationId) {
    conversation = await getConversation(conversationId);
  } else {
    throw new Error('Conversation not found');
  }
  // TODO: Deprecated for now.
  // TODO: Update it when you add direct messaging.
  // if (!conversationId) {
  //   conversation = await createConversation({
  //     name: user.name,
  //     members: [user._id, recipientId] as Types.DocumentArray<Types.ObjectId>,
  //   });
  // }

  // if (!conversation)
  //   throw new Error("Something went wrong. We couldn't create a conversation.");

  const message = await Message.create({
    ...params,
    conversation: conversationId,
    sender: user._id,
  });
  conversation.messages?.push(message._id);
  await conversation.save();
  return message;
};

/**
 * Get message by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IMessage | null>}
 */
export const getMessageById = (
  messageId: mongoose.Types.ObjectId
): Promise<IMessageDoc | null> => Message.findById(messageId);

/**
 * Update a message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @param {Partial<IMessage>} messageBody
 * @returns {Promise<IMessageDoc | null>}
 */
export const updateMessageById = async (
  messageId: mongoose.Types.ObjectId,
  messageBody: MessageData
): Promise<IMessageDoc | null> => {
  const message = await getMessageById(messageId);
  if (!message) throw new Error('Message not found');

  Object.assign(message, messageBody);
  await message.save();
  return message;
};

/**
 * Delete a message by id
 * @param {mongoose.Types.ObjectId} messageId
 * @param {mongoose.Types.ObjectId} conversationId
 */
export const deleteMessage = async (
  messageId: mongoose.Types.ObjectId,
  conversationId: mongoose.Types.ObjectId
) => {
  const message = await getMessageById(messageId);
  const conversation = await getConversation(conversationId);

  if (!message) throw new Error('Message not found');
  if (!conversation) throw new Error('Conversation not found');

  conversation.messages?.pull(messageId);
  await conversation.save();
  message.remove();
};
