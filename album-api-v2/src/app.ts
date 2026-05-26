import express, { Application } from 'express';
import cors from 'cors';
import albumsRouter from './routes/albums';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.type('text/plain').send('Hit the /albums endpoint to retrieve a list of albums!');
  });

  app.use('/albums', albumsRouter);

  return app;
}

export default createApp;
