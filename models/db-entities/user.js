"use strict";

const bcrypt = require("bcrypt");
const createGuts = require("../model-guts");
const { createError, BAD_REQUEST } = require("../../common/error-utils");

const name = "User";
const tableName = "users";
const selectableProps = [
  "id",
  "email",
  "password",
  "updated_at",
  "created_at",
];

const SALT_ROUNDS = 10;
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const beforeSave = async (user) => {
  if (!user.password) {
    return Promise.resolve(user);
  }

  return hashPassword(user.password)
    .then((hash) => ({ ...user, password: hash }))
    .catch((err) => `Error hashing password: ${err}`);
};

const postFind = (user) => {
  if (user && user.password) {
    delete user.password;
  }
  return user;
};

module.exports = (knex) => {
  const guts = createGuts({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const create = (props) => beforeSave(props).then((user) => guts.create(user));

  const getAndVerify = async (email, password) => {
    const matchErrorMsg = "email and password do not match";
    const user = await guts.findOne({ email });

    if (!user) throw createError(BAD_REQUEST, matchErrorMsg);

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) throw createError(BAD_REQUEST, matchErrorMsg);

    return user;
  };

  const find = (filters) =>
    guts.find(filters).then((users) => {
      return users.map((user) => postFind(user));
    });

  const findOne = (filters) =>
    guts.findOne(filters).then((user) => postFind(user));

  const findAll = () =>
    guts.findAll().then((users) => {
      return users.map((user) => postFind(user));
    });

  const findAllUserIn = (userIds) => {
    if (!userIds) {
      return [];
    }
    return knex("users").select(selectableProps).whereIn("id", userIds);
  };

  return {
    ...guts,
    create,
    getAndVerify,
    find,
    findOne,
    findAll,
    findAllUserIn,
  };
};
