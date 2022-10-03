const userController = require("./user-controller");
const Router = require("express-promise-router");
const router = new Router();
const { authenticate } = require("../../middlewares/authentication");

router.put("/", authenticate, userController.update);
router.get("/", authenticate, userController.getAll);
router.get("/:userId", userController.getById);
router.post("/login", userController.login);
router.post("/register", userController.register);

module.exports = router;
