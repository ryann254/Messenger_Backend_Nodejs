import httpStatus from 'http-status';
import User, { IUserDoc } from '../mongodb/models/user';
import mongoose from 'mongoose';

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
export const getUser = async (userId: mongoose.Types.ObjectId) => {
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
export const updateUser = async (
  userId: mongoose.Types.ObjectId,
  userBody: Partial<IUserDoc>
) => {
  console.log(userBody);
  // Check if we are updating the whole user body or just a partial
  if (userBody.email) {
    if (await User.isEmailTaken(userBody.email, userId)) {
      throw new Error('Email already taken');
    }
    return User.findByIdAndUpdate(userId, userBody);
  }

  // Update the user body partially(online: false => online: true)
  const user = await getUser(userId);

  if (!user) throw new Error('User not found');

  Object.assign(user, userBody);
  await user.save();
  return user;
};
