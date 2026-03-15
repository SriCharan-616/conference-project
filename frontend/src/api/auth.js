import axiosClient from "./axiosClient";

export const loginUser = (data) => axiosClient.post("/login/", data);
export const registerUser = (data) => axiosClient.post("/register/", data);