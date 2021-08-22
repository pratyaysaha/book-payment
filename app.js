const express = require("express")
const mongoose = require("mongoose")
const sessions = require("express-session")
const MongoStore = require("connect-mongo")
require("dotenv/config")
const { checkoutPage } = require("./controller/orderController")
//middleware import
const redirectToOrder = require("./middleware/redirectToOrder")
//route import
const apiRoute = require("./routes/apiRoute")
//globals
const app = express()

//express-session setup
const IN_PROD = process.env.NODE_ENV === "production"
const SESSION_EXPIRE = Number(process.env.SESSION_AGE) * 60 * 60 * 1000
app.use(
	sessions({
		name: process.env.SESSION_NAME,
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		store: MongoStore.create({
			mongoUrl: process.env.DB_CONNECTION,
		}),
		cookie: {
			sameSite: true,
			maxAge: SESSION_EXPIRE,
			secure: IN_PROD,
			httpOnly: false,
		},
	})
)
//ejs setup
app.use(express.static(__dirname + "/css"))
app.use(express.static(__dirname + "/js"))
app.use(express.static(__dirname + "/images"))
app.set("view engine", "ejs")

// middle ware setup
app.use("/api", apiRoute)

//routes
app.get("/", (req, res) => {
	res.render("index")
})
app.get("/purchase", (req, res) => {
	res.render("payment")
})
app.get("/checkout/:purchaseId", checkoutPage)
app.get("/contact", (req, res) => {
	res.render("contact")
})
app.get("/terms", (req, res) => {
	res.render("terms")
})
app.get("/terms-and-conditions", (req, res) => {
	res.redirect("/terms")
})
app.get("/about", (req, res) => {
	res.render("about")
})
app.get("/about-us", (req, res) => {
	res.redirect("/about")
})
app.get("/about-me", (req, res) => {
	res.redirect("/about")
})
app.get("/refund", (req, res) => {
	res.render("refund")
})
app.get("/refund-policy", (req, res) => {
	res.redirect("/refund")
})
app.get("/success", (req, res) => {
	res.render("success")
})
app.get("/failure", (req, res) => {
	res.render("failure")
})
/* //test
app.get("/test-checkout", (req, res) => {
	res.render("test")
})
app.get("/test-payment", redirectToOrder, (req, res) => {
	console.log(req.session)
	res.render("rzpay", { data: req.session.data })
}) */

//db setup
mongoose.connect(process.env.DB_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
})

app.listen(process.env.PORT || 3000)
