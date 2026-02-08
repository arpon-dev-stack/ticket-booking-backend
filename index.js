import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import expressValidator from 'express-validator';

import connectDB from './config/db.js';
import route from './src/v1/routes/rootRoute.js';

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
// app.use(expressValidator());

app.use('/swiftbus', route);

const startServer = async () => {
  try {

    await connectDB();

    app.listen(port, () => {

      console.log(`Server started http://localhost:${port}`);

    })

  } catch (error) {

    console.log("Failed to start the server");

  }
}

startServer();