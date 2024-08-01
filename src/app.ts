import express, { Request, Response } from 'express';
import { routes } from './routes/routes';
const app = express();
const port = 3000;

app.use(
  express.json(),
  routes,
);

app.post('/prod', (req: Request, res: Response) => {
  console.log(req.body)
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});