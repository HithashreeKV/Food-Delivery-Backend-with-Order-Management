const express = require("express");
const { addMenuItem, getMenu } = require("../controllers/menuController");

const router = express.Router();

router.post("/", addMenuItem);
router.get("/", getMenu);

module.exports = router;
