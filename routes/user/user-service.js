const { User } = require("../../models");
const { generateToken } = require("../../middlewares/authentication");
const {
  createError,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../../common/error-utils");

const login = async (email, password) => {
  if (!email) {
    throw createError(400, "missing email");
  }
  if (!password) {
    throw createError(400, "missing password");
  }

  const user = await User.getAndVerify(email, password);
  const token = generateToken({ userId: user.id, role: user.role });
  delete user.password;

  return { ...user, token };
};

const register = async ({ email, password, role }) => {
  if (!email) {
    throw createError(400, "missing email");
  }
  if (!password) {
    throw createError(400, "missing password");
  }

  let user = await User.findOne((builder) =>
    builder.where({ email })
  );

  if (user) {
    throw createError(400, "email already exists");
  }
  const result = await User.create({ email, password, role });

  const token = generateToken({
    userId: result[0].id,
    role: result[0].role,
  });

  user = result[0];
  delete user.password;

  return { ...user, token };
};

const getById = async (caller, targetUser) => {
  if (!caller || !targetUser) {
    throw createError(BAD_REQUEST, "missing user");
  }

  const user =
    String(caller) === String(targetUser)
      ? await getMe(caller)
      : await getOtherUserById(targetUser);

  if (!user) {
    throw createError(NOT_FOUND, "user not found");
  }

  return user;
};

const findAllUserIn = async (userIds) => {
  return User.findAllUserIn(userIds);
};

const getAll = async () => {
  return User.findAll({});
};

// --------- support funcs -----------

const getMe = async (userId) => {
  return User.findOne({ id: userId });
};

const getOtherUserById = async (userId) => {
  return User.findOne({ id: userId });
};

const deleteUser = async () => {};

const findUniqueValue = (baseData, elements) => {
  if (!baseData) {
    baseData = [];
  }
  const elementsAsLowerCase = Array.isArray(elements)
    ? elements.map((element) => element.toLowerCase())
    : [elements.toLowerCase()];
  const baseDataAsLowerCase = baseData.map((element) => element.toLowerCase());

  elementsAsLowerCase.forEach((ele, index) => {
    if (!baseDataAsLowerCase.includes(ele)) {
      baseData.push(Array.isArray(elements) ? elements[index] : elements);
    }
  });
  return baseData;
};

module.exports = {
  login,
  register,
  getById,
  getMe,
  deleteUser,
  findAllUserIn,
  getAll,
};
