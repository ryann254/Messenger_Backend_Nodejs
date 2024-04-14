import { MongoClient } from 'mongodb';
import { createAdapter } from '@socket.io/mongo-adapter';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Emitter } from '@socket.io/mongo-emitter';
import dotenv from 'dotenv';

import app from '.';

dotenv.config();

const server = createServer(app);
const io = new Server(server);

const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
const PORT = process.env.PORT || 3000;

const main = async () => {
  await mongoClient.connect();
  const mongoCollection = mongoClient
    .db('Messenger-SocketIO-MongodbAdapter')
    .collection('messages');

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
  const changeStream = mongoCollection.watch(pipeline);

  // Set up MongoDB adapter for Socket.io => Enables the broadcasting of messages across multiple Socket.IO server instances using MongoDB as the message broker.
  io.adapter(
    createAdapter(mongoCollection, {
      addCreatedAtField: true,
    })
  );

  // Set up an emitter for broadcasting changes
  const emitter = new Emitter(mongoCollection);

  // Listen for changes in the MongoDB collection
  changeStream.on('change', (change) => {
    console.log('Change Detected: ', change);
    // Emit the change to all connected clients
    emitter.emit('change', change);
  });

  io.on('connection', (socket) => {
    // Broadcast that a user is online
    console.log('a user connected');
    // Update the current user's online status

    // Get chatrooms associated with the current user(rooms with messages)
    // Catch all listener for debugging
    // Listen for the `change` event emitted by the server
    socket.on('change', (msg) => {
      console.log(msg);
      socket.broadcast.emit('message', msg);
    });

    // Handle disconnection
    // Update the current user's online status
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

export default main;
