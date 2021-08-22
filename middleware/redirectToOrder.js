const redirectToOrder = (req, res, next) => {
	if (!req.session.data) {
		res.redirect("/test-checkout")
	} else {
		next()
	}
}
module.exports = redirectToOrder
