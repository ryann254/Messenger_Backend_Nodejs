import httpStatus from 'http-status';
import User, { IUser } from '../mongodb/models/user';

/**
 * Create a user
 * @param {IUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: IUser) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new Error('Email already taken');
  }

  return User.create(userBody);
};
