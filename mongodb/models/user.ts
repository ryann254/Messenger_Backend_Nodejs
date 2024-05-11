import { Document } from 'mongodb';
import mongoose, { Model } from 'mongoose';

const UserSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value: string) {
        if (
          !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          )
        ) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: new Date(),
    },
    conversation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.static(
  'isEmailTaken',
  async function (
    email: string,
    excludeUserId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

// Middleware to update `lastActive` field on save.
UserSchema.pre('save', function (next) {
  this.lastActive = new Date();
  next();
});

const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;

export interface IUser {
  username: string;
  email: string;
  password?: string;
  online: boolean;
  lastActive: Date;
  conversation?: mongoose.Types.ObjectId;
}

export interface IUserModel extends Model<IUser> {
  isEmailTaken(
    email: string,
    excludeUserId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

export interface IUserDoc extends IUser, Document {}
