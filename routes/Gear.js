const express = require("express");
const router = express.Router();
const gearController = require("../controllers/Gear");

router.get("/", gearController.index);

router.get("/:id", gearController.show);

module.exports = router;