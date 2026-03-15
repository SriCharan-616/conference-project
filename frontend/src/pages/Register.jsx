import React, { useState } from "react";
import { registerUser } from "../api/auth";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "author"
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(form);
            alert("Registered Successfully!");
        } catch (err) {
            setError("Registration failed!");
        }
    };

    return (
        <div>
            <h2>Register</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                /><br />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                /><br />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                /><br />

                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="author">Author</option>
                    <option value="attendee">Attendee</option>
                    <option value="organiser">Organiser</option>
                </select><br />

                <button>Register</button>
            </form>
        </div>
    );
}