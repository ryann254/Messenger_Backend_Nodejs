import { createAdapter } from '@socket.io/mongo-adapter';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Emitter } from '@socket.io/mongo-emitter';
import dotenv from 'dotenv';

import app from './app';
import mongoose from 'mongoose';
import Message from './mongodb/models/message';

dotenv.config();

const PORT = process.env.PORT || 4500;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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
  const pipeline = [
    {
      $match: {
        operationType: { $in: ['insert', 'update', 'delete'] },
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
    // Get chatrooms associated with the current user(rooms with messages)
    // Catch all listener for debugging
    // Listen for the `change` event emitted by the server
    // Emit the change to all connected clients
    emitter.emit('change', change);
  });

  io.on('connection', (socket) => {
    // Broadcast that a user is online
    console.log('a user connected');
    // Update the current user's online status

    // Handle disconnection
    // Update the current user's online status
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
main();
