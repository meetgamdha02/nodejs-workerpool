const workerpool = require("workerpool");
const axios = require("axios");

const heavyTask = async () => {
  try {
    const requestData = await axios.get("https://swapi.dev/api/people/1");
    const result = requestData.data;
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

workerpool.worker({
  heavyTask: heavyTask,
});
