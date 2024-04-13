import mongoose, { Mongoose } from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
