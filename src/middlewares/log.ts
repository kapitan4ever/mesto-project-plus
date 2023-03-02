import winston from "winston";
import expressWinston from "express-winston";

// eslint-disable-next-line import/prefer-default-export
export const reqLog = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "request.log" }),
  ],
  format: winston.format.json(),
});
