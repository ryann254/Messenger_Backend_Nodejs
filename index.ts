import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  // Broadcast that a user is online
  console.log('a user connected');
  // Update the current user's online status

  // Get chatrooms associated with the current user(rooms with messages)
  // Catch all listener for debugging
  // Handle the message
  socket.on('message', (msg) => {
    console.log(msg);
    socket.broadcast.emit('message', msg);
  });

  // Handle disconnection
  // Update the current user's online status
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
