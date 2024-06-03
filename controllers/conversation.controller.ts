import { Request, Response } from 'express';
import { createConversation } from '../services/conversation.service';
import httpStatus from 'http-status';

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
) => {};

export const deleteConversationController = async (
  req: Request,
  res: Response
) => {};
