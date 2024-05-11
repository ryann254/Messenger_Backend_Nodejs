import { createAdapter } from '@socket.io/mongo-adapter';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Emitter } from '@socket.io/mongo-emitter';
import dotenv from 'dotenv';

import app from './app';
import mongoose from 'mongoose';
import Message from './mongodb/models/message';
import { queryConversations } from './services/conversation.service';
import Conversation from './mongodb/models/conversation';

dotenv.config();

const PORT = process.env.PORT || 4500;

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  pingTimeout: 60000,
  allowEIO3: true,
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

const mongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

const main = async () => {
  await mongooseConnect();
  // Access the MongoDB collection directly to pass it to `createAdapter()` & `Emitter()`
  const db = mongoose.connection.db;
  const messagesCollection = db.collection('messages');

  // Filter out all internal operations performed by Mongodb's adapter
  // TODO: Find a way to include message delete alerts but Not system delete alerts
  const pipeline = [
    {
      $match: {
        operationType: { $in: ['insert', 'update'] },
        $expr: {
          $and: [
            { $ne: ['$fullDocument.type', 2] }, // Exclude documents with 'type: 2'
            { $ne: ['$fullDocument.nsp', '/'] }, // Exclude documents with 'nsp: /'
          ],
        },
      },
    },
  ];

  // Set up MongoDB change streams
  const changeStream = Message.watch(pipeline);

  // Set up MongoDB adapter for Socket.io => Enables the broadcasting of messages across multiple Socket.IO server instances using MongoDB as the message broker.
  io.adapter(
    createAdapter(messagesCollection, {
      addCreatedAtField: true,
    })
  );

  // Set up an emitter for broadcasting changes
  const emitter = new Emitter(messagesCollection);

  // Listen for changes in the MongoDB collection
  changeStream.on('change', (change) => {
    // Listen for the `change` event emitted by the server
    // Extract the text message from the change event document
    const {
      fullDocument: { conversation, text },
    } = change;
    // Emit the text to all connected clients
    emitter.emit('change', conversation, text);
  });

  io.on('connection', async (socket) => {
    // Broadcast that a user is online
    console.log('a user connected');
    // Update the current user's online status

    // Get all conversations with messages
    if (socket.handshake.auth.userId) {
      const conversationsWithMessages = await queryConversations(
        socket.handshake.auth.userId
      );
      socket.emit('conversations', conversationsWithMessages);
    }

    // Catch all listener for debugging
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    // Refetch and resend rooms to the frontend in the case of a disconnection.
    if (!socket.recovered) {
      try {
        const conversationsWithMessages = await Conversation.find({})
          .populate('messages')
          .populate('members')
          .sort({ _id: -1 })
          .skip(socket.handshake.auth.serverOffset || 0)
          .limit(10);
        socket.emit('conversations', conversationsWithMessages);
      } catch (error) {
        console.error(
          'Error fetching conversations for disconnected users',
          error
        );
      }
    }

    // Handle disconnection
    // Update the current user's online status
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  io.engine.on('connection_error', (err) => {
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
  });
};
main();
