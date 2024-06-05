import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createUser, getUser, updateUser } from '../services/user.service';

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  return res.status(httpStatus.CREATED).send(user);
};

export const getUserController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) throw new Error('User ID not found');
  const user = await getUser(userId);
  return res.status(httpStatus.OK).send(user);
};

export const updateUserController = async (req: Request, res: Response) => {};

export const deleteUserController = async (req: Request, res: Response) => {};
