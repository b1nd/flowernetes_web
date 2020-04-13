import api from "./api";

export default {
  login: credentials => api.post("/login", credentials),
  userInfo: () => api.get("/auth/info")
}