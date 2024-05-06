import { zValidator } from "@hono/zod-validator";
import { ZodType, ZodTypeDef } from "zod";

export function InputJSONValidator(schema: ZodType<any, ZodTypeDef, any>) {
	return zValidator("json", schema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					issues: result.error.issues,
					message: "Invalid Input",
				},
				400
			);
		}
	});
}
