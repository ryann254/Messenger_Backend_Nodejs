import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  createMessage,
  deleteMessage,
  updateMessageById,
} from '../services/message.service';

export const createMessageController = async (req: Request, res: Response) => {
  if (!req.body.user) throw new Error('User Not Found');
  const message = await createMessage(req.body.message, req.body.user);
  res.status(httpStatus.CREATED).send(message);
};

export const updateMessageController = async (req: Request, res: Response) => {
  if (typeof req.params['messageId'] === 'string') {
    const { messageId } = req.params;
    if (!req.body.user) throw new Error('User Not Found');

    const message = await updateMessageById(messageId, req.body.message);
    return res.status(httpStatus.OK).send(message);
  }
};

export const deleteMessageController = async (req: Request, res: Response) => {
  console.log('here');
  if (typeof req.params['messageId'] === 'string') {
    const { messageId, conversationId } = req.params;
    if (!req.body.user) throw new Error('User Not Found');

    await deleteMessage(messageId, conversationId);
    return res.status(httpStatus.NO_CONTENT).send();
  }
};
