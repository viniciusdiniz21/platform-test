import axios from "axios";

const url = "http://localhost:5000/"

const token = ""

const api = axios.create({
  baseURL: url,
  headers: { /* Authorization: `Bearer ${token}`, */
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
});

export default api;