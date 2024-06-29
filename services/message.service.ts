import mongoose from 'mongoose';
import Message, { IMessage, IMessageDoc } from '../mongodb/models/message';
import { getConversation } from './conversation.service';
import { IUserDoc } from '../mongodb/models/user';

/**
 * Create a message
 * @param {IMessage} messageBody
 * @param {IUserDoc} user logged in user
 * @returns {Promise<IMessageDoc>}
 */
export const createMessage = async (
  { recipientId, conversationId, ...params },
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
  messageBody: Partial<IMessage>
): Promise<IMessageDoc | null> => {
  const message = await getMessageById(messageId);
  if (!message) throw new Error('Message not found');

  Object.assign(message, messageBody);
  await message.save();
  return message;
};
