const route = require("express").Router();


route.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});


module.exports = route;
