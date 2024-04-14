import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
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
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
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

// Middleware to update `lastActive` field on save.
UserSchema.pre('save', function (next) {
  this.lastActive = new Date();
  next();
});

const User = mongoose.model('User', UserSchema);
export default User;
