import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  const text: string = 'course review assignment!';
  res.send(text);
});

app.all('*', notFound);
app.use(globalErrorHandler);

export default app;