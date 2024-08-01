import { app } from './app';

const port = 3000;

export const server = app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});