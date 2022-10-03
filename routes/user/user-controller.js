const userService = require("./user-service");

const login = async (req, res) => {
  const { email, password } = req.body || {};
  const user = await userService.login(email, password);

  return res.status(200).send({ ok: true, message: "succeed", data: user });
};

const register = async (req, res) => {
  const { email, password, role = "" } = req.body || {};
  const user = await userService.register({ email, password, role });

  return res.status(201).send({ ok: true, message: "created", data: user });
};

const update = async (req, res) => {
  const props = req.body || {};
  const requestUser = req.decodedUser;

  const user = await userService.update(requestUser.userId, props);

  return res.status(200).send({ ok: true, message: "succeed", data: user });
};

const getById = async (req, res) => {
  const userId = req.params.userId || {};

  const user = await userService.getById(userId, userId);

  return res.status(200).send({ ok: true, message: "succeed", data: user });
};

const getUserStories = async (req, res) => {
  const userId = req.params.userId || {};
  const stories = await storyService.getById(userId, userId);

  return res.status(200).send({ ok: true, message: "succeed", data: stories });
};

const getAll = async (req, res) => {
  const users = await userService.getAll();

  return res.status(200).send({ ok: true, message: "succeed", data: users });
};

const getUserTrips = async (req, res) => {
  const userId = req.params.userId || {};
  const trips = (await tripService.getByUserId(userId)) || [];

  return res.status(200).send({ ok: true, message: "succeed", data: trips });
};

const getUserInvitations = async (req, res) => {
  const decodedUser = req.decodedUser || {};
  const result = await invitationService.getUserInvitations(decodedUser.userId);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const follow = async (req, res) => {
  const follower = req.decodedUser || {};
  const interestedUser = req.params.userId || {};
  const result = await userService.follow(follower.userId, interestedUser);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const unfollow = async (req, res) => {
  const unfollower = req.decodedUser || {};
  const notInterestedUser = req.params.userId || {};
  const result = await userService.unfollow(
    unfollower.userId,
    notInterestedUser
  );

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const getUserFollower = async (req, res) => {
  const userId = req.params.userId || {};
  const result = await userService.getFollow(userId, "follower");

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const getUserFollowing = async (req, res) => {
  const userId = req.params.userId || {};
  const result = await userService.getFollow(userId, "following");

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const notIntest = async (req, res) => {
  const user = req.decodedUser || {};
  const notInterestedUser = req.params.userId || {};
  const result = await userService.notInterest(user.userId, notInterestedUser);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const likeStory = async (req, res) => {
  const user = req.decodedUser || {};
  const storyId = req.params.storyId || {};
  const result = await userService.likeStory(user, storyId);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const unlikeStory = async (req, res) => {
  const user = req.decodedUser || {};
  const storyId = req.params.storyId || {};
  const result = await userService.unlikeStory(user.userId, storyId);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const getSuggestedUsersAsDefault = async (req, res) => {
  const user = req.decodedUser || {};
  console.log(user);
  const result = await userService.getSuggestedUsersAsDefault(user.userId);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

const loginWechat = async (req, res) => {
  return res.sendFile(path.resolve(__dirname, "", "index.html"));
};

const registerViaWechat = async (req, res) => {
  let code = req.query.code;

  const result = await userService.registerViaWechat(code);

  return res.status(200).send({ ok: true, message: "ok", data: result });
};

module.exports = {
  login,
  register,
  update,
  getById,
  getUserStories,
  getAll,
  getUserTrips,
  getUserInvitations,
  follow,
  getUserFollower,
  getUserFollowing,
  notIntest,
  unfollow,
  likeStory,
  unlikeStory,
  getSuggestedUsersAsDefault,
  loginWechat,
  registerViaWechat,
};
