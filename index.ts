import express from 'express';
import main from './socket';

const app = express();

main().catch((err) => console.error(err));

export default app;
