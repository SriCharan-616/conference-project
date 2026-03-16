import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useConferences, useSubmitPaper } from "../../hooks/useAPI";
import { FileUpload } from "../../components/FileUpload";

export default function PaperSubmit() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const { data: conferencesData } = useConferences();
  const submitPaperMutation = useSubmitPaper();
  const [selectedFile, setSelectedFile] = useState(null);

  const conferences = conferencesData?.results || [];

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      await submitPaperMutation.mutateAsync({
        title: data.title,
        abstract: data.abstract,
        conference: data.conference,
        file: selectedFile,
      });

      toast.success("Paper submitted successfully!");
      navigate("/author/papers");
    } catch (error) {
      toast.error(error.message || "Failed to submit paper");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        <h1 className="page-header mb-2">Submit Paper</h1>
        <p className="page-subtitle mb-8">
          Share your research with the academic community
        </p>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Conference Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Conference *
              </label>
              <select
                {...register("conference", { required: "Conference is required" })}
                className="input-field"
              >
                <option value="">-- Choose a conference --</option>
                {conferences.map((conf) => (
                  <option key={conf.id} value={conf.id}>
                    {conf.title} ({new Date(conf.start_date).getFullYear()})
                  </option>
                ))}
              </select>
              {errors.conference && (
                <p className="error-text">{errors.conference.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Title *
              </label>
              <input
                type="text"
                placeholder="Enter paper title"
                className="input-field"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title must be at least 10 characters",
                  },
                })}
              />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract *
              </label>
              <textarea
                placeholder="Enter paper abstract (250-500 words)"
                rows="5"
                className="input-field"
                {...register("abstract", {
                  required: "Abstract is required",
                  minLength: {
                    value: 100,
                    message: "Abstract must be at least 100 characters",
                  },
                })}
              />
              {errors.abstract && <p className="error-text">{errors.abstract.message}</p>}
            </div>

            {/* File Upload */}
            <FileUpload
              name="paper_file"
              label="Upload Paper (PDF) *"
              accept=".pdf"
              maxSize={10 * 1024 * 1024}
              onChange={setSelectedFile}
              value={selectedFile}
              error={errors.file?.message}
            />

            {/* Keywords (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g., AI, Machine Learning, Neural Networks"
                className="input-field"
                {...register("keywords")}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/author/papers")}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitPaperMutation.isPending}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isSubmitting || submitPaperMutation.isPending
                  ? "Submitting..."
                  : "Submit Paper"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
