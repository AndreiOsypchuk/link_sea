import axios from "axios";

export const Api = axios.create({ baseURL: "http://192.168.1.4:4000/api" });
// export const Api = axios.create({ baseURL: "http://localhost:4000/api" });
