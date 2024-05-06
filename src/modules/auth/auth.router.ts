import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import Users, { ZodUsersSchema } from "./auth.modal";
import { setCookie } from "hono/cookie";
import { SignJwt } from "../../lib/tokens";
import { HTTPException } from "hono/http-exception";
import { cookieConfig } from "../../configs/cookieConfig";
import { ZodType, ZodTypeDef } from "zod";
import { InputJSONValidator } from "../../middlewares/InputValidators";
import { requireUser } from "../../middlewares/authenticator";
import { SCOPES, oauth2Client } from "../../configs/G-OAuth2Client";
import { google } from "googleapis";
import { AuthController } from "./auth.controller";

const authRouter = new Hono();

authRouter.post(
	"/users",
	InputJSONValidator(ZodUsersSchema),
	AuthController.credentialCreate
);

authRouter.post(
	"/login",
	InputJSONValidator(ZodUsersSchema),
	AuthController.credentialLogin
);

authRouter.get("/me", requireUser, AuthController.currentUser);

authRouter.get("/signin/google", AuthController.googleOauthInit);

authRouter.get("/google/callback", AuthController.googleOauthCallback);

export default authRouter;
