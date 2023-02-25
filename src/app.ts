import express, { json } from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import { tmpId } from './tmp';
import { PORT, URL_DB } from './config';

const app = express();

app.use(json());
app.use(tmpId);
app.use(routes);

async function connect() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(URL_DB);
    console.log(`DB Connect`);
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (error) {
    if(error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.log("Ошибка подключения к базе данных");
    }
    console.log('Ошибка запуска сервера', error);
  }
};

connect();


