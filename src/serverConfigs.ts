import { Hono } from "hono";
import { logger } from "hono/logger";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { setCookie } from "hono/cookie";
import router from "./modules";
import { cookieConfig } from "./configs/cookieConfig";
import UserDeserializer from "./middlewares/userDeserializer";

function ServerConfig(app: Hono) {
	app.use(logger());
	app.use(
		bodyLimit({
			maxSize: 10 * 1024 * 1024, // 10MB
			onError: (c) => {
				throw new HTTPException(400, {
					cause: "Body Limit Exceed",
					message: "Overflow Size should be below 10MB",
				});
			},
		})
	);
	app.use(
		cors({
			//@ts-check check before prod
			origin: "*",
			credentials: true,
		})
	);

	app.use(async (c, next) => {
		setCookie(c, "lang", "en", cookieConfig({}));
		await next();
	});

	app.get("/", async (c) => {
		return c.json({
			message: "Api server is nominal!!",
		});
	});

	app.use(UserDeserializer);

	app.route("/", router);

	app.onError((err, c) => {
		if (err instanceof HTTPException) {
			return c.json(
				{
					message: err.message,
					status: "false",
					title: err.cause,
				},
				err.status
			);
		}
		return c.json(
			{
				title: "Internal Server Error",
				message: err.message,
				status: false,
			},
			500
		);
	});
}

export default ServerConfig;
