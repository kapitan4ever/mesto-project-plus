import winston from "winston";
import expressWinston from "express-winston";

// eslint-disable-next-line import/prefer-default-export
export const errLog = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});
