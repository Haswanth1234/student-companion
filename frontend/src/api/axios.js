import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
const token = localStorage.getItem("studentToken");

axios.get("http://localhost:5000/api/student", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export default api;
