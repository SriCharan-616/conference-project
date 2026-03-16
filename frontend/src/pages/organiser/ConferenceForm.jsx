import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useConference,
  useCreateConference,
  useUpdateConference,
} from "../../hooks/useAPI";

export default function ConferenceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: conference, isLoading: loadingConference } = useConference(
    id,
    { enabled: isEdit }
  );
  const createMutation = useCreateConference();
  const updateMutation = useUpdateConference();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      theme: "",
      start_date: "",
      end_date: "",
      submission_deadline: "",
      location: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (isEdit && conference) {
      reset({
        title: conference.title,
        theme: conference.theme || "",
        start_date: conference.start_date?.split("T")[0] || "",
        end_date: conference.end_date?.split("T")[0] || "",
        submission_deadline: conference.submission_deadline?.split("T")[0] || "",
        location: conference.location,
        status: conference.status,
      });
    }
  }, [conference, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id,
          ...data,
        });
        toast.success("Conference updated successfully!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Conference created successfully!");
      }

      navigate("/organiser/conferences");
    } catch (error) {
      toast.error(error.message || "Failed to save conference");
    }
  };

  if (isEdit && loadingConference) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        <h1 className="page-header mb-2">
          {isEdit ? "Edit Conference" : "Create Conference"}
        </h1>
        <p className="page-subtitle mb-8">
          {isEdit
            ? "Update conference details and schedule"
            : "Organize a new academic conference"}
        </p>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conference Title *
              </label>
              <input
                type="text"
                placeholder="Enter conference title"
                className="input-field"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme *
              </label>
              <input
                type="text"
                placeholder="Enter conference theme (e.g., AI & Future)"
                className="input-field"
                {...register("theme", { required: "Theme is required" })}
              />
              {errors.theme && <p className="error-text">{errors.theme.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                placeholder="Enter conference location"
                className="input-field"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className="error-text">{errors.location.message}</p>
              )}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  className="input-field"
                  {...register("start_date", {
                    required: "Start date is required",
                  })}
                />
                {errors.start_date && (
                  <p className="error-text">{errors.start_date.message}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  className="input-field"
                  {...register("end_date", {
                    required: "End date is required",
                  })}
                />
                {errors.end_date && (
                  <p className="error-text">{errors.end_date.message}</p>
                )}
              </div>
            </div>

            {/* Submission Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Submission Deadline *
              </label>
              <input
                type="date"
                className="input-field"
                {...register("submission_deadline", {
                  required: "Submission deadline is required",
                })}
              />
              {errors.submission_deadline && (
                <p className="error-text">{errors.submission_deadline.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select className="input-field" {...register("status")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/organiser/conferences")}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
                  ? "Saving..."
                  : isEdit
                  ? "Update Conference"
                  : "Create Conference"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
