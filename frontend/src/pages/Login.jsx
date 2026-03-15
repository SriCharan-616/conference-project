import React, { useState } from "react";
import { loginUser } from "../api/auth";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await loginUser(form);
        alert("Login Success!");
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                /><br />
                <input type="password" placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                /><br />
                <button>Login</button>
            </form>
        </div>
    );
}