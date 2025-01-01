import axios from "axios";

export const fetchData = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("/api/data", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
