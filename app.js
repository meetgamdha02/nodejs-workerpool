const app = require("express")();
const workerpool = require("workerpool");
const pool = workerpool.pool();
const _ = require("lodash");

const heavyTask = async () => {
  let count = 0;
  let i = 0;
  console.log(`hererererer`);
  while (i < 100000) {
    i++;
    count++;
  }

  return count;
};

app.get("/", (req, res, next) => {
  res.send("Hi Meet");
});

const promiseHandlingFunction = async (params) => {
  const { shouldUsePool = true } = params;
  const promiseArr = [];
  for (let i = 0; i < 10; i++) {
    if (shouldUsePool) {
      promiseArr.push(pool.exec(heavyTask));
    } else {
      promiseArr.push(heavyTask());
    }
  }

  const result = await Promise.all(promiseArr);
  console.log(result);
  return _.flatten(result);
};

app.get("/heavy", async (req, res) => {
  console.log(workerpool.cpus);
  console.time(`start`);
  try {
    const temp = await promiseHandlingFunction({ shouldUsePool: true });
    pool.terminate();
    res.send(temp);
  } catch (e) {
    console.log(e);
  }

  console.timeEnd(`start`);
});

app.get("/heavy2", async (req, res) => {
  console.log(workerpool.cpus);
  console.time(`start`);
  try {
    const temp = await promiseHandlingFunction({ shouldUsePool: false });
    res.send(temp);
  } catch (e) {
    console.log(e);
  }

  console.timeEnd(`start`);
});

app.listen(3000, () => console.log("Listening to port 3000"));
