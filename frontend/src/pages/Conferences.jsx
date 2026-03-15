import React, { useEffect, useState } from "react";
import { getConferences } from "../api/conference";
import { Link } from "react-router-dom";

export default function Conferences() {
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        getConferences().then((res) => setConferences(res.data));
    }, []);

    return (
        <div>
            <h2>Available Conferences</h2>
            <ul>
                {conferences.map((c) => (
                    <li key={c.id}>
                        <Link to={`/conference/${c.id}`}>{c.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}