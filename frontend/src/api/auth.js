import axiosClient from "./axiosClient";

// Register user
export const registerUser = async (data) => {
    return axiosClient.post("/register/", data);
};

// Login user
export const loginUser = async (data) => {
    return axiosClient.post("/login/", data);
};