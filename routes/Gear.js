const express = require("express");
const router = express.Router();
const gearController = require("../controllers/Gear");

router.get("/", gearController.index);
router.get("/new", gearController.newForm);
router.post("/", gearController.create);
router.get("/:id", gearController.show);
router.get("/:id/edit", gearController.editForm);
router.post("/:id/edit", gearController.update);

module.exports = router;