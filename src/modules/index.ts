import { Hono } from "hono";
import authRouter from "./auth/auth.router";

const router = new Hono();

router.route("/auth", authRouter);

export default router;
