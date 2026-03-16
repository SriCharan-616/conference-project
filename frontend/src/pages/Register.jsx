import React, { useState } from "react";
import { registerUser } from "../api/auth";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "author" // default role
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await registerUser(form);
            setSuccess("Registered successfully! You can now login.");
            setForm({
                username: "",
                email: "",
                password: "",
                role: "author"
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                /><br />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                /><br />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="author">Author</option>
                    <option value="attendee">Attendee</option>
                    <option value="organiser">Organiser</option>
                </select><br /><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}