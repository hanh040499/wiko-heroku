"use strict";

const createGuts = require("../model-guts");

const name = "NodeState";
const tableName = "node_states";
const selectableProps = [
  "type",
  "state",
  "title",
  "section",
  "user_id",
  "index",
];

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const findOne = (filters) => guts.findOne(filters);

  const find = (filters) => guts.find(filters);

  const create = (props) => guts.create(props);

  const updateWithFilter = ({ props, filters }) =>
    guts.updateWithFilter(props, filters);

  return {
    ...guts,
    create,
    findOne,
    updateWithFilter,
    find,
  };
};
