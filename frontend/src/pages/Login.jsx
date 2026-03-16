import React, { useState } from "react";
import { loginUser } from "../api/auth";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginUser(form);
            const { token, role, user_id } = res.data;

            // Store JWT in localStorage
            localStorage.setItem("access_token", token);
            localStorage.setItem("user_role", role);
            localStorage.setItem("user_id", user_id);

            alert("Login successful!");
            window.location.href = "/"; // redirect to homepage
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}