import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export async function login(username: string, password: string): Promise<string> {
  const response = await api.post<{ access_token: string }>("/auth/login", { username, password });
  localStorage.setItem("mplads_access_token", response.data.access_token);
  return response.data.access_token;
}
