const express = require("express");
const router = express.Router();
const gearController = require("../controllers/Gear");

router.get("/", gearController.index);

module.exports = router;