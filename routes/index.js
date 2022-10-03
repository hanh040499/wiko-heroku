const Router = require("express-promise-router");
const router = new Router();
const userRoutes = require("./user");
const nodeStateRoutes = require("./nodeState");

router.use("/api/users", userRoutes);
router.use("/api/node-states", nodeStateRoutes);

module.exports = () => router;
