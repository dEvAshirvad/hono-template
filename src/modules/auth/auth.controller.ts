import { Context } from "hono";
import Users, { UsersSchema } from "./auth.modal";
import { SignJwt } from "../../lib/tokens";
import { setCookie } from "hono/cookie";
import { cookieConfig } from "../../configs/cookieConfig";
import { HTTPException } from "hono/http-exception";
import { SCOPES, oauth2Client } from "../../configs/G-OAuth2Client";
import { google } from "googleapis";
import mongoose from "mongoose";
import { findMissingFields } from "../../lib/missingFields";

export class AuthController {
	public static async credentialCreate(c: Context) {
		try {
			const body = await c.req.json();

			const hashedPassword = await Bun.password.hash(body.password);

			const {
				_id: id,
				email,
				roles,
			} = await Users.create({ ...body, password: hashedPassword });

			const userToken = await SignJwt({
				id,
				email,
				roles,
				exp: Math.floor(Date.now() / 1000) + 15,
			});

			setCookie(c, "access_token", userToken, cookieConfig({ maxAge: 15 }));

			return c.json({
				message: "User Registered",
			});
		} catch (error) {
			throw error;
		}
	}

	public static async credentialLogin(c: Context) {
		const body = await c.req.json();

		const existingUser = await Users.findOne({ email: body.email });
		if (!existingUser) {
			throw new HTTPException(404, {
				message: "User Not found",
			});
		}

		const {
			_id: id,
			email,
			password,
			roles,
			name,
			gender,
			verified,
			image,
			collections,
		} = existingUser;

		const verifyPassword = await Bun.password.verify(body.password, password);

		if (!verifyPassword) {
			throw new HTTPException(404, {
				message: "Invalid Password",
			});
		}

		const userToken = await SignJwt({
			id,
			email,
			name,
			gender,
			verified,
			image,
			roles,
			collections,
			exp: Math.floor(Date.now() / 1000) + 60 * 5,
		});

		setCookie(c, "access_token", userToken, cookieConfig({ maxAge: 300 }));

		return c.json({
			message: "user logged in",
		});
	}

	public static async currentUser(c: Context) {
		const me = await c.get("jwtPayload");

		// const user = await Users.findOne({ email: me?.email });
		// if (!user) {
		// 	return c.json({
		// 		me,
		// 	});
		// }
		// const missingFields = findMissingFields(user, UsersSchema);

		return c.json({
			me,
		});
	}

	public static async googleOauthInit(c: Context) {
		const authUrl = oauth2Client.generateAuthUrl({
			access_type: "offline", // Request refresh tokens
			scope: SCOPES,
		});

		return c.redirect(authUrl);
	}

	public static async googleOauthCallback(c: Context) {
		const { code } = c.req.query();
		try {
			const { tokens } = await oauth2Client.getToken(code);
			oauth2Client.setCredentials(tokens);

			const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

			const {
				data: { email, gender, name, picture, verified_email },
			} = await oauth2.userinfo.get();

			let existingUser = await Users.findOne({ email });

			if (!existingUser) {
				existingUser = await Users.create({
					email,
					gender,
					name,
					image: picture,
					verified: verified_email,
				});
			}

			const { _id: id, roles, collections, verified, image } = existingUser;

			const userToken = await SignJwt({
				id,
				email,
				name,
				gender,
				verified,
				image,
				roles,
				collections,
				exp: Math.floor(Date.now() / 1000) + 60 * 5,
			});

			setCookie(c, "access_token", userToken, cookieConfig({ maxAge: 300 }));

			return c.redirect("/auth/me");
		} catch (error) {
			throw error;
		}
	}
}
