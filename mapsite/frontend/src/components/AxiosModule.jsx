import axios from "axios";

/*
 * This component produces base requests for POST and GET functions using axios.
 */

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true, // Send credentials (cookies)
});

// Base request function for POST requests
const post = (url, data) => {
  return axiosInstance.post(url, data);
};

// Base request function for GET requests
const get = (url, params) => {
  return axiosInstance.get(url, { params });
};

export { post, get };
