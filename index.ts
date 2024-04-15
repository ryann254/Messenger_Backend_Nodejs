import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import main from './socket';
import routes from './routes/message.route';

const app = express();

// Set security HTTP headers
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Handle routes
app.use('/api/v1', routes);

main().catch((err) => console.error(err));

export default app;
