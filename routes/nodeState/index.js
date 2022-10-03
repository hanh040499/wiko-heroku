const nodeStateController = require("./node-state-controller");
const Router = require("express-promise-router");
const router = new Router();

router.get("/:user_id/:type/:title", nodeStateController.getNode);
router.get("/:user_id/:state", nodeStateController.getNodes);

router.post("/", nodeStateController.createNode);

router.put("/:user_id/:type/:title", nodeStateController.updateNode);

module.exports = router;
