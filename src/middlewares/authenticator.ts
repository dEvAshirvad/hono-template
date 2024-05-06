import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export async function requireUser(c: Context, next: Next) {
	const user = await c.get("jwtPayload");
	if (!user) {
		throw new HTTPException(401, {
			message: "You have been signed out.",
			cause: "Need to relogin",
		});
	}

	await next();
}
