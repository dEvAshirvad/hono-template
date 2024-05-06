import { CookieOptions } from "hono/utils/cookie";

export function cookieConfig({
	maxAge,
	sameSite = "None",
	httpOnly = true,
	domain = process.env.NODE_ENV === "prod"
		? ".clashersacademy.com"
		: "localhost",
	secure = true,
}: CookieOptions): CookieOptions {
	return {
		maxAge,
		sameSite,
		httpOnly,
		domain,
		secure,
	};
}
