const express = require("express");

const userController = require("./app/Controllers/User/userController");

const routes = express.Router();

routes.get("/", (req, res) => {
  return res.send("Ok");
});

routes.post("/user", userController.store);
routes.get("/user/:id", userController.index);
routes.get("/users", userController.show);
routes.put("/user/:id", userController.update);
routes.delete("/user/:id", userController.delete);

routes.post("/login", userController.login);

module.exports = routes;
