import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export interface IUsers extends Document {
	email: string;
	name: string;
	gender: string;
	image: string;
	verified: boolean;
	onboarding: boolean;
	roles: string[];
	password: string;
	collections: "users" | "admins";
}

export const ZodUsersSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

const UsersSchema = new Schema<IUsers>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
		},
		gender: {
			type: String,
		},
		image: {
			type: String,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		onboarding: {
			type: Boolean,
			default: false,
		},
		roles: {
			type: [String],
			default: ["subscriber"],
		},
		password: {
			type: String,
		},
		collections: {
			type: String,
			enum: ["users", "admins"],
			default: "users",
		},
	},
	{
		timestamps: true,
	}
);

const Users = mongoose.model<IUsers>("tbl_users", UsersSchema);
export default Users;
