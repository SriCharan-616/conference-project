import React, { useState } from "react";
import { submitPaper } from "../api/papers";

export default function SubmitPaper() {
    const [formData, setFormData] = useState({
        title: "",
        conference: "",
        file: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("title", formData.title);
        form.append("conference", formData.conference);
        form.append("file", formData.file);

        await submitPaper(form);
        alert("Paper Submitted!");
    };

    return (
        <div>
            <h2>Submit Paper</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Paper Title"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                /><br />

                <input placeholder="Conference ID"
                    onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                /><br />

                <input type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                /><br />

                <button>Submit</button>
            </form>
        </div>
    );
}