import { HTTPException } from "hono/http-exception";
import { sign, decode, verify } from "hono/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";

const Token = process.env.TOKEN as SignatureKey;

export async function SignJwt(payload: object, secret = Token) {
	try {
		return await sign(payload, secret);
	} catch (error) {
		throw error;
	}
}

export async function VerifyJWT(token: string, secret = Token) {
	try {
		return await verify(token, secret);
	} catch (error: any) {
		if (error.name === "JwtTokenExpired") {
			throw new HTTPException(401, {
				cause: "Need to Relogin",
				message: "Token Expired",
			});
		}
	}
}
