import { Hono } from "hono";
import connectDB from "./configs/DB";
import { errorlogger, logger } from "./configs/logger";
import ServerConfig from "./serverConfigs";

const app = new Hono();
const PORT = process.env.PORT || 3030;

ServerConfig(app);

connectDB()
	.then(() => {
		logger.info("Running Status", "Database connected");
	})
	.catch((err) => {
		errorlogger.error("Database Connection Failed", err);
		process.exit();
	});

logger.info("Server is listening at http://localhost:" + PORT);

export default {
	port: PORT,
	fetch: app.fetch,
};
