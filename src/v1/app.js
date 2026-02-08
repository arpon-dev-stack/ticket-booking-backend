import express from 'express';
import cors from 'cors';
import route from './routes/rootRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/swiftbus', route);

export default app;
