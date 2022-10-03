"use strict";

module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString:
        "postgres://fuatghkhhronvy:c7cea67c49506e1dc0bb3bed611775d99e7e88067b001a453d7cc3d6110dccea@ec2-52-204-157-26.compute-1.amazonaws.com:5432/db8q4hllf3ptba",
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds`,
    },
  },
  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds`,
    },
  },
};
