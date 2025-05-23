import Axios from "./axios-interceptor";
import jwt from "jsonwebtoken";
export async function login({ email, password }) {
  const response = await Axios.post("/auth/login", { email, password });
  const { token, user } = response.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return { token, user };
}

export async function signup({ name, email, password }) {
  const response = await Axios.post("/auth/signup", { name, email, password });
  return response.data;
}

export async function logout() {
  await Axios.post("/auth/logout", {}, { withCredentials: true });
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { success: true };
}

export async function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  const response = await Axios.get("/auth/me");
  return response.data.user;
}
export function verifyToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
