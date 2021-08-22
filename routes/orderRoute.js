//library import
const express = require("express")

//controller import
const orderController = require("../controller/orderController")
//globals
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.post("/", orderController.orderPlacement)
router.post("/afterpayment", orderController.afterPayment)

module.exports = router
