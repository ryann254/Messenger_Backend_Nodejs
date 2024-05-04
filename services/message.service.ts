import { Types } from 'mongoose';
import Message from '../mongodb/models/message';
import { createConversation } from './conversation.service';

export const createMessage = async (
  { recipientId, recipientName, ...params },
  user
) => {
  let conversation = await createConversation({
    name: recipientName,
    members: [user.id, recipientId] as Types.DocumentArray<Types.ObjectId>,
  });
  if (!conversation)
    throw new Error("Something went wrong. We couldn't create a conversation.");

  const message = await Message.create({
    ...params,
    conversation: conversation.id,
    sender: user.id,
  });
  conversation.messages?.push(message);
  await conversation.save();
  return message;
};
