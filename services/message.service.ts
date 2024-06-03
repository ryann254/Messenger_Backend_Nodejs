import Message from '../mongodb/models/message';
import {
  createConversation,
  getConversation,
  getConversationWithUsers,
} from './conversation.service';

export const createMessage = async (
  { recipientId, conversationId, ...params },
  user
) => {
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
  //     members: [user.id, recipientId] as Types.DocumentArray<Types.ObjectId>,
  //   });
  // }

  // if (!conversation)
  //   throw new Error("Something went wrong. We couldn't create a conversation.");

  const message = await Message.create({
    ...params,
    conversation: conversationId,
    sender: user.id,
  });
  conversation.messages?.push(message._id);
  await conversation.save();
  return message;
};
