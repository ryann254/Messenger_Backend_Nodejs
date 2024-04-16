import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import main from './socket';
import routes from './routes';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3018;

// Set security HTTP headers
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Handle routes
app.use('/api/v1', routes);

// main().catch((err) => console.error(err));
mongoose.connect(process.env.MONGODB_URI || '').then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
