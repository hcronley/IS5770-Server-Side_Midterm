const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/Checkout");

router.get("/", checkoutController.index);
router.get("/new", checkoutController.newForm);
router.post("/", checkoutController.create);
router.post("/:id/return", checkoutController.markReturned);

module.exports = router;