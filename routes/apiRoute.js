const express = require("express")
const router = express.Router()

//route imports
const orderRoute = require("./orderRoute")
//middlewares
router.use("/order", orderRoute)

module.exports = router
