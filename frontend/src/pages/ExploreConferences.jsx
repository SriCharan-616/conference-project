import React from "react";

const conferences = [
  { id: 1, name: "AI Conference 2026", location: "Chennai", date: "March 15, 2026", fee: "₹500" },
  { id: 2, name: "Cloud Summit 2026", location: "Bangalore", date: "April 10, 2026", fee: "₹800" },
  { id: 3, name: "Data Science Expo", location: "Hyderabad", date: "May 5, 2026", fee: "₹600" },
];

function ExploreConferences() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Explore Conferences</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {conferences.map((conf) => (
          <div key={conf.id} style={{
            border: "1px solid #ccc", borderRadius: "8px",
            padding: "16px", width: "250px",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3>{conf.name}</h3>
            <p>📍 {conf.location}</p>
            <p>📅 {conf.date}</p>
            <p>💰 {conf.fee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreConferences;