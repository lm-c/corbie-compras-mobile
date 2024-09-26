import axios from "axios";

const api = axios.create({
  baseURL: "https://lm.ind.br:63021/",
});

export { api };
