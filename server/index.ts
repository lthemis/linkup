// Imports
import express from 'express';
import morgan from 'morgan'; // eslint-disable-line import/no-extraneous-dependencies
import cors from 'cors';
// eslint-disable-next-line
import router from './routes/index';
// import prisma from './db';

const corsConfig = {
  // REMOVE-START
  origin: 'http://localhost:3000',
  credentials: true,
  // REMOVE-END
};

const PORT = 4000;

const app = express();

app.use(cors(corsConfig));
app.use(morgan('short'));
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`🚀🚀🚀 Server up and listening on http://localhost:${PORT} ! 🚀🚀🚀`); // eslint-disable-line
});