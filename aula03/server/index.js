import server from "./server.js";
import { logger } from "./util.js";
import config from "./config.js";

server.listen(config.port).on("listening", () => logger.info(`Server running at ${config.port}!!`));


/**
 * impede que a aplicação caia, caso um erro não tratado aconteça
 * uncaughtException => erro de throw
 * unhandledRejection => error em algumaPromise
 */

process.on("uncaughtException", error => logger.error(`uncaughtException happerned: ${error.stack || error}`));

process.on("unhandledRejection", error => logger.error(`unhandledRejection happerned: ${error.stack || error}`));
