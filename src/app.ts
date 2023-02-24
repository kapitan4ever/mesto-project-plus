import express, { json } from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import { tmpId } from './tmp';
import { PORT, URL_DB } from './config';

const app = express();

app.use(json());
app.use(tmpId);
app.use(routes);

mongoose.set('strictQuery', false);
mongoose.connect(URL_DB);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
