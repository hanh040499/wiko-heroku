const { NodeState } = require("../../models");

const createNode = async (data) => {
  const result = await NodeState.create(data);

  const node = result[0];

  return node;
};

const getNode = async (params) => {
  return NodeState.findOne(params);
};

const getNodes = async (params) => {
  return NodeState.find(params);
};

const updateNode = async ({ props, filters }) => {
  return NodeState.updateWithFilter({ props, filters });
};

module.exports = {
  getNode,
  createNode,
  updateNode,
  getNodes,
};
