const nodeStateService = require("./node-state-service");

const createNode = async (req, res) => {
  const postData = req.body;

  const node = await nodeStateService.createNode(postData);

  return res.status(200).send({ ok: true, message: "succeed", data: node });
};

const getNode = async (req, res) => {
  const params = req.params;

  const node = await nodeStateService.getNode(params);

  return res.status(200).send({ ok: true, message: "succeed", data: node });
};

const getNodes = async (req, res) => {
  const params = req.params;

  const nodes = await nodeStateService.getNodes(params);

  return res.status(200).send({ ok: true, message: "succeed", data: nodes });
};

const updateNode = async (req, res) => {
  const props = req.body;
  const filters = req.params;

  const node = await nodeStateService.updateNode({ props, filters });

  return res.status(200).send({ ok: true, message: "succeed", data: node });
};

module.exports = { getNode, createNode, updateNode, getNodes };
