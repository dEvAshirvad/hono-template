import mongoose from "mongoose";

const DB_URL = process.env.DB_URL as string;

export default function () {
	return new Promise((resolve, reject) => {
		mongoose.set("strictQuery", false);
		mongoose
			.connect(DB_URL)

			.then(() => {
				resolve("Successfully connected to database");
			})
			.catch((error) => {
				reject(error);
			});
	});
}
