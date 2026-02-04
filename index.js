import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import busesRouter from './routes/buses.js';
import userRouter from './routes/users.js'
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/buses', busesRouter);
app.use('/user', userRouter)

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/busdb';

async function start() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();