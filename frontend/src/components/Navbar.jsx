import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ padding: 20, background: "#eee" }}>
            <Link to="/">Home</Link> |{" "}
            <Link to="/conferences">Conferences</Link> |{" "}
            <Link to="/submit-paper">Submit Paper</Link> |{" "}
            <Link to="/login">Login</Link>
        </nav>
    );
}