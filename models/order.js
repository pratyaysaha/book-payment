const mongoose = require("mongoose")
require("mongoose-type-url")
const address = mongoose.Schema(
	{
		line1: {
			type: String,
			required: true,
		},
		line2: {
			type: String,
		},
		state: {
			type: String,
			required: true,
		},
		district: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		pincode: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
)
const order = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	address: {
		type: address,
		required: true,
	},
	email: {
		type: String,
	},
	orderId: {
		type: String,
	},
	paymentId: {
		type: String,
	},
	paymentSignature: {
		type: String,
	},
	isPayment: {
		type: Boolean,
		default: false,
	},
	isShipped: {
		type: Boolean,
		default: false,
	},
	isDelivered: {
		type: Boolean,
		default: false,
	},
	shipping_label: {
		type: mongoose.SchemaTypes.Url,
	},
	shipping_label_id: {
		type: String,
	},
	orderCreated: {
		type: Date,
		default: new Date(),
	},
})

module.exports = mongoose.model("Order", order)
