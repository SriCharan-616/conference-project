import React, { useState } from "react";
import { registerForConference } from "../api/registration";
import { useParams } from "react-router-dom";

export default function RegisterConference() {
    const { id } = useParams();
    const [userId, setUserId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerForConference({ user: userId, conference: id });
        alert("Registration Successful!");
    };

    return (
        <div>
            <h2>Register for Conference</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="User ID"
                    onChange={(e) => setUserId(e.target.value)}
                /><br />

                <button>Register</button>
            </form>
        </div>
    );
}