const BASE_URL =
  window.location.hostname === "wiko-application.herokuapp.com"
    ? "https://wiko-application.herokuapp.com/api"
    : "http://localhost:4400/api";

export const users = {
  login() {
    return BASE_URL + "/users/login";
  },
  register() {
    return BASE_URL + "/users/register";
  },
};

export const nodeState = {
  getArticle({ user_id, type, title }) {
    return BASE_URL + `/node-states/${user_id}/${type}/${title}`;
  },
  getArticles({ user_id, state }) {
    return BASE_URL + `/node-states/${user_id}/${state}`;
  },
  createNode() {
    return BASE_URL + "/node-states";
  },
  updateNode({ user_id, type, title }) {
    return BASE_URL + `/node-states/${user_id}/${type}/${title}`;
  },
};
