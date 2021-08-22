const rzpay = require("razorpay")
const validator = require("validator")
require("dotenv/config")

const orderModel = require("../models/order")

const instance = new rzpay({
	key_id: process.env.RZPAY_ID,
	key_secret: process.env.RZPAY_SECRET,
})

const verifyNumber = (number) => {
	return validator.isMobilePhone(number, ["en-IN"])
}
const verifyEmail = (email) => {
	return validator.isEmail(email)
}
const verifyPincode = (code) => {
	return validator.isPostalCode(code, ["IN"])
}
const orderPlacement = (req, res) => {
	const validFields = [
		"name",
		"phone",
		"line1",
		"line2",
		"state",
		"district",
		"city",
		"pincode",
		"email",
	]
	const optionalField = ["line2", "email"]
	var data = {}
	validFields.map((item) => {
		data[item] = req.body[item]
	})

	for (item in data) {
		if (
			optionalField.includes(item) &&
			(data[item] === "" || data[item] === undefined || data[item] === " ")
		) {
			delete data[item]
			continue
		}
		if (data[item] === "" || data[item] === " " || data[item] === undefined) {
			return res.status(409).json({
				error: `${item} invalid`,
				errorOccured: `${item}`,
			})
		}
	}
	if (!verifyNumber(data.phone)) {
		return res.status(409).json({
			error: `Mobile Number Invalid`,
			errorOccured: `phone`,
		})
	}
	if (data.email && !verifyEmail(data.email)) {
		return res.status(409).json({
			error: `Email Invalid`,
			errorOccured: `email`,
		})
	}
	if (!verifyPincode(data.pincode)) {
		return res.status(409).json({
			error: `Pincode Invalid`,
			errorOccured: `pincode`,
		})
	}
	var options = {
		amount: 17000,
		currency: "INR",
		receipt: "order_rcptid_11",
		notes: data,
	}
	var address = {
		line1: data.line1,
		line2: data.line2,
		state: data.state,
		district: data.district,
		city: data.city,
		pincode: data.pincode,
	}
	instance.orders.create(options, async (err, order) => {
		if (err !== null) {
			return res.status(409).json({
				error: "Order could not be placed",
				errorOccured: "razorpay",
			})
		}
		var newOrder = new orderModel(data)
		newOrder.orderId = order.id
		newOrder.address = address
		newOrder.orderCreated = new Date()
		try {
			const saveOrder = await newOrder.save()
			req.session.data = saveOrder
			return res.status(201).json({
				data: saveOrder,
			})
		} catch (err) {
			return res.status(409).json({
				error: "Database Unresponsive",
				errorOccured: "database",
			})
		}
	})
}
const afterPayment = (req, res) => {
	console.log(req.body)
	console.log(req.body.razorpay_payment_id)
	instance.payments
		.fetch(req.body.razorpay_payment_id)
		.then(async (paymentDocument) => {
			console.log(paymentDocument)
			if (paymentDocument.status === "captured") {
				try {
					const updateOrder = await orderModel.updateOne(
						{ _id: req.session.data._id },
						{
							$set: {
								paymentId: req.body.razorpay_payment_id,
								isPayment: true,
							},
						}
					)
				} catch (err) {
					console.log(err)
				}
				delete req.session.data
				return res.redirect("/success")
			} else {
				delete req.session.data
				return res.redirect("/failure")
			}
		})
}
const checkoutPage = async (req, res) => {
	try {
		const orderData = await orderModel.findById(req.params.purchaseId)
		if (!orderData || orderData === null) {
			return res.redirect("/failure")
		} else if (orderData.isPayment) {
			return res.redirect("/")
		}
		return res.render("final-checkout", { data: orderData })
	} catch (err) {
		return res.redirect("/failure")
	}
}
module.exports = { orderPlacement, afterPayment, checkoutPage }
