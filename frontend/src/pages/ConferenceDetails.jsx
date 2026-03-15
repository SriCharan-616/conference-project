import React, { useEffect, useState } from "react";
import { getConferenceById } from "../api/conference";
import { useParams, Link } from "react-router-dom";

export default function ConferenceDetails() {
    const { id } = useParams();
    const [conference, setConference] = useState(null);

    useEffect(() => {
        getConferenceById(id).then((res) => setConference(res.data));
    }, []);

    if (!conference) return <p>Loading...</p>;

    return (
        <div>
            <h2>{conference.title}</h2>
            <p>Date: {conference.date}</p>
            <p>Location: {conference.location}</p>

            <Link to={`/register/${conference.id}`}>Register</Link>
        </div>
    );
}