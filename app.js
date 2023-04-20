const app = require("express")();
const workerpool = require("workerpool");
const _ = require("lodash");
const axios = require("axios");

const pool = workerpool.pool(__dirname + "/worker.js");

app.get("/", (req, res, next) => {
  res.send("Hi Meet");
});

const heavyTask2 = async () => {
  try {
    const requestData = await axios.get("https://swapi.dev/api/people/1");
    const result = requestData.data;
    return result;
  } catch (e) {
    console.log(e);
  }
};

const promiseHandlingFunction = async (params) => {
  const { shouldUsePool = true } = params;
  const promiseArr = [];
  for (let i = 0; i < 15; i++) {
    if (shouldUsePool) {
      promiseArr.push(pool.exec("heavyTask"));
    } else {
      promiseArr.push(heavyTask2());
    }
  }

  const result = await Promise.all(promiseArr);
  console.log(result);
  return _.flatten(result);
};

const doLongWaitFunction = async () => {
  let counter = 0;
  while (counter++ < 900000000);
  return _.toString(counter);
};

app.get("/heavy", async (req, res) => {
  try {
    const temp = await doLongWaitFunction({ shouldUsePool: true });
    pool.terminate();
    res.send(temp);
  } catch (e) {
    console.log(e);
  }
});

app.get("/heavy2", async (req, res) => {
  // console.time(`start`);
  try {
    const temp = await heavyTask2({ shouldUsePool: false });
    console.log(temp);
    res.send(temp);
  } catch (e) {
    console.log(e);
  }

  // console.timeEnd(`start`);
});

app.listen(443, () => console.log("Listening to port 443"));
