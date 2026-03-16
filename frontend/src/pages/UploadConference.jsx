import React, { useState, useEffect } from "react";
import axios from "../api/axiosClient"; // your axios instance
import { uploadConference } from "../api/conference";
 
export default function UploadConference() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [role, setRole] = useState(""); // user role

    // Get user role from localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem("user_role");
        if (storedRole) setRole(storedRole);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (role !== "organiser") {
        setError("Only organisers can upload conferences.");
        return;
    }

    try {
        // send role as part of the data
        await uploadConference({ ...form, role });

        setSuccess("Conference uploaded successfully!");
        setForm({
            title: "",
            description: "",
            start_date: "",
            end_date: "",
            location: "",
        });
    } catch (err) {
        console.error(err);
        setError("Failed to upload conference.");
    }
};

    // If not organiser, show message instead of form
    if (role && role !== "organiser") {
        return <p style={{ color: "red" }}>You are not authorized to upload conferences.</p>;
    }

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <h2>Upload Conference</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                /><br /><br />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                /><br /><br />

                <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                /><br /><br />

                <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    required
                /><br /><br />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    required
                /><br /><br />

                <button type="submit">Upload Conference</button>
            </form>
        </div>
    );
}