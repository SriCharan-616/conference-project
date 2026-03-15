import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Conferences from "./pages/Conferences";
import ConferenceDetails from "./pages/ConferenceDetails";
import SubmitPaper from "./pages/SubmitPaper";
import RegisterConference from "./pages/RegisterConference";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Conferences />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/conferences" element={<Conferences />} />
                <Route path="/conference/:id" element={<ConferenceDetails />} />
                <Route path="/submit-paper" element={<SubmitPaper />} />
                <Route path="/register/:id" element={<RegisterConference />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;