const express = require("express");
const app = express();
const { OPENAI_API_KEY } = require("../openai.config.js");
const axios = require("axios");

app.use(express.static("dist"));
app.use(express.json());

const PORT = 3000;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/curie", (req, res) => {
  const { prompt, temp, engine_id } = req.body;
  axios
    .post(`https://api.openai.com/v1/engines/${engine_id}/completions`, {
      prompt: prompt,
      max_tokens: 5,
      temperature: temp,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "\n",
    })
    .then((data) => {
      console.log(data.data);
      res.send(data.data);
    })
    .catch((err) => res.send(err));
});

app.listen(PORT, () => {
  console.log(`server listening at port: ${PORT}`);
});
