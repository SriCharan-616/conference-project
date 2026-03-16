import axiosClient from "./axiosClient";

// Get all conferences
export const getConferences = () => axiosClient.get("/conferences/");

// Get a specific conference by ID
export const getConferenceById = (id) => axiosClient.get(`/conferences/${id}/`);

// Upload a new conference (for organizers only)
export const uploadConference = (conferenceData) => {
    return axiosClient.post("/conferences/", conferenceData);
};