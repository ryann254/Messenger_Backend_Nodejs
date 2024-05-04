import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createUser } from '../services/user.service';

export const createUserController = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
};

export const updateUserController = async (req: Request, res: Response) => {};

export const deleteUserController = async (req: Request, res: Response) => {};
