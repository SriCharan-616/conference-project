import axiosClient from "./axiosClient";

export const registerForConference = (data) =>
    axiosClient.post("/registration/", data);