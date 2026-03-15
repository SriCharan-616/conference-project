import axiosClient from "./axiosClient";

export const getConferences = () => axiosClient.get("/conferences/");
export const getConferenceById = (id) => axiosClient.get(`/conferences/${id}/`);