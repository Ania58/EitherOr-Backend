const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  res.status(200).send("Logged out successfully");
});

module.exports = router;
