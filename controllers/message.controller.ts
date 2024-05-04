import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createMessage } from '../services/message.service';

export const createMessageController = async (req: Request, res: Response) => {
  if (!req.body.user) throw new Error('User Not Found');

  const message = await createMessage(req.body.message, req.body.user);
  res.status(httpStatus.CREATED).send(message);
};

export const updateMessageController = async (
  req: Request,
  res: Response
) => {};

export const deleteMessageController = async (
  req: Request,
  res: Response
) => {};