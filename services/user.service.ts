import httpStatus from 'http-status';
import User, { IUserDoc } from '../mongodb/models/user';

/**
 * Create a user
 * @param {IUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: IUserDoc) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new Error('Email already taken');
  }

  return User.create(userBody);
};

/**
 * Get a user
 * @param {IUser} userId id belonging to a specified user.
 * @returns {Promise<IUserDoc>}
 */
export const getUser = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Updates a user
 * @param userId id belonging to a specified user.
 * @param {IUser} userBody new user body
 * @returns {Promise<IUserDoc>}
 */
export const updateUser = async (userId: string, userBody: IUserDoc) =>
  User.findByIdAndUpdate(userId, userBody);
