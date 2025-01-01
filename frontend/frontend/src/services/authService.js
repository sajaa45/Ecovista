import axios from "axios";

export const login = async (email, password) => {
  const response = await axios.post("/api/auth/login", { email, password });
  localStorage.setItem("token", response.data.token); // Save token for authenticated requests
};
