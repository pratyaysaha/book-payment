var email
if (!document.querySelector(".purcahse.email")) {
	email = null
} else {
	email = document.querySelector(".purcahse.email").innerHTML.trim()
}
var options = {
	key: "rzp_test_VRXPbBudsU0xFQ", // Enter the Key ID generated from the Dashboard
	amount: "17000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
	currency: "INR",
	name: "Himadri Saha",
	description: "Payment for Aakul Brikhsho",
	image: "https://www.logodesign.net/logo/crane-truck-with-hook-4110ld.png",
	order_id: document.querySelector(".input.orderId").value, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
	callback_url: "/api/order/afterpayment",
	prefill: {
		name: document.querySelector(".purchase.name").value,
		email: email,
		contact: document.querySelector(".purchase.phone").value,
	},
	theme: {
		color: "#3399cc",
	},
}
var rzp1 = new Razorpay(options)
document.querySelector(".button.pay").onclick = function (e) {
	rzp1.open()
	e.preventDefault()
}
