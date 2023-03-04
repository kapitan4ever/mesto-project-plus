export const { PORT = 3000 } = process.env;
export const { URL_DB = "mongodb://localhost:27017/mestodb" } = process.env;

export const regex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\/+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\/+.~#?&//=]*)/;
