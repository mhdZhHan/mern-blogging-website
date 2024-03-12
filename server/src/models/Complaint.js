import mongoose, { Schema } from "mongoose"

const complaintSchema = mongoose.Schema(
	{
		report_title: {
			type: String,
			required: true,
		},
		report_message: {
			type: String,
			required: true,
		},
		blog: {
			type: Schema.Types.ObjectId,
			ref: "blogs",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
		reported_by: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

export default mongoose.model("complaints", complaintSchema)
