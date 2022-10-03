/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("node_states", (t) => {
    t.string("type");
    t.string("state");
    t.string("title");
    t.string("section");
    t.integer("user_id");
    t.integer("index");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("node_states");
};
