import { Request, Response } from 'express';
import {
  createConversation,
  updateConversation,
} from '../services/conversation.service';
import httpStatus from 'http-status';
import { updateUser } from '../services/user.service';

export const createConversationController = async (
  req: Request,
  res: Response
) => {
  if (!req.body.user) throw new Error('User Not Found');
  const conversation = await createConversation(req.body.conversation);
  return res.status(httpStatus.CREATED).send(conversation);
};

export const updateConversationController = async (
  req: Request,
  res: Response
) => {
  const { conversationId } = req.params;
  const { conversation, user } = req.body;

  if (!user) throw new Error('User Not Found');

  if (conversationId) {
    // Remove any duplicate ids from the conversation.members array
    conversation.members = Array.from(new Set(conversation.members));
    await updateUser(user._id, user);
    const result = await updateConversation(conversationId, conversation);
    return res.status(httpStatus.OK).send(result);
  } else {
    throw new Error('Conversation ID not found');
  }
};

export const deleteConversationController = async (
  req: Request,
  res: Response
) => {};
