import axios from "axios";

const TOKEN_KEY = "np_access_token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach stored access token to every outgoing request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to sign-in on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.replace("/signin");
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default api;
