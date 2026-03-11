import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ExploreConferences from "./pages/ExploreConferences";
import UploadPaper from "./pages/UploadPaper";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#333", display: "flex", gap: "20px" }}>
        <Link to="/explore" style={{ color: "white" }}>Explore Conferences</Link>
        <Link to="/upload" style={{ color: "white" }}>Upload Paper</Link>
      </nav>
      <Routes>
        <Route path="/explore" element={<ExploreConferences />} />
        <Route path="/upload" element={<UploadPaper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;