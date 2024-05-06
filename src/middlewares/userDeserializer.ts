import { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { SignJwt, VerifyJWT } from "../lib/tokens";
import { cookieConfig } from "../configs/cookieConfig";

async function UserDeserializer(c: Context, next: Next) {
	try {
		const { access_token } = getCookie(c);

		if (!access_token) {
			return await next();
		}

		const payload = await VerifyJWT(access_token);

		c.set("jwtPayload", payload);

		try {
			const userToken = await SignJwt({
				...payload,
				exp: Math.floor(Date.now() / 1000) + 60 * 5,
			});

			setCookie(c, "access_token", userToken, cookieConfig({ maxAge: 300 }));
		} catch (error) {
			throw error;
		}

		return await next();
	} catch (error) {
		setCookie(c, "access_token", "");
		throw error;
	}
}

export default UserDeserializer;
