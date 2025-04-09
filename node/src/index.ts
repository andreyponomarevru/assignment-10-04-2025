import express from "express";
import { requestsRouter } from "./controllers/router";
import { PORT } from "./config/env";
import { handle404Error } from "./middlewares/handle-404-error";
import { handleErrors } from "./middlewares/handle-errors";
import {
  handleSIGINT,
  onUncaughtException,
  onUnhandledRejection,
  onWarning,
} from "./process-handlers";

let expressApp = express();
const router = express.Router().use("/api/requests", requestsRouter);

expressApp.use(express.json());
expressApp.use(router);
expressApp.use(handle404Error);
expressApp.use(handleErrors);

expressApp.listen(PORT, () => {
  console.log(`The server is listening on http://localhost:${PORT}`);
});

//

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);
process.on("SIGINT", handleSIGINT);
