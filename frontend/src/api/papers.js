import axiosClient from "./axiosClient";

export const submitPaper = (formData) =>
    axiosClient.post("/papers/submit/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });