import { Document } from "mongoose";
import { Schema } from "mongoose";

export function findMissingFields(
	document: Document,
	schema: Schema
): string[] {
	const missingFields: string[] = [];
	const schemaPaths = schema.paths;

	// Iterate through all paths in the schema
	for (const path in schemaPaths) {
		if (schemaPaths.hasOwnProperty(path)) {
			//@ts-ignore
			if (typeof document[path] === "undefined") {
				// If the field is undefined in the document, it's considered missing
				missingFields.push(path);
			}
		}
	}

	return missingFields; // Return the list of missing fields
}
