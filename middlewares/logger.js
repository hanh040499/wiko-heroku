const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const customLogger = (req, res, next) => {
  //middleware function
  let current_datetime = new Date();

  let method = req.method;
  let url = req.url;
  const cloneBody = JSON.parse(JSON.stringify(req.body));
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  let log = `[${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
  delete cloneBody.password;

  console.log(log, cloneBody);

  next();
};

const exportableHandlers = {
  customLogger,
};

// All exportable stored as an array (e.g., for including in Express app.use())
const all = Object.keys(exportableHandlers).map(
  (key) => exportableHandlers[key]
);

module.exports = {
  ...exportableHandlers,
  all,
};
