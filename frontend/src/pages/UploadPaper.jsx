import React, { useState } from "react";
import axios from "axios";

function UploadPaper() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [conference, setConference] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !conference || !file) {
      setMessage("⚠️ Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("conference", conference);
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/api/papers/upload/", formData);
      setMessage("✅ Paper uploaded successfully!");
      setTitle(""); setAuthor(""); setConference(""); setFile(null);
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h1>Upload Research Paper</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input placeholder="Paper Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input placeholder="Conference Name" value={conference} onChange={(e) => setConference(e.target.value)} />
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Paper"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPaper;