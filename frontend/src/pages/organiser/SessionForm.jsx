import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUsers } from "../../hooks/useAPI";

export default function SessionForm() {
  const { conferenceId, sessionId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!sessionId;

  const { data: usersData } = useUsers();
  const [selectedPanelMembers, setSelectedPanelMembers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      date: "",
      time_slot: "",
      location: "",
      session_type: "talk",
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: Implement API call to create/update session
      toast.success(
        isEdit ? "Session updated successfully!" : "Session created successfully!"
      );
      navigate(`/organiser/conferences/${conferenceId}`);
    } catch (error) {
      toast.error(error.message || "Failed to save session");
    }
  };

  const users = usersData?.results || [];

  const togglePanelMember = (userId) => {
    setSelectedPanelMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        <h1 className="page-header mb-2">
          {isEdit ? "Edit Session" : "Create Session"}
        </h1>
        <p className="page-subtitle mb-8">
          {isEdit ? "Update session details" : "Add a new session to conference"}
        </p>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                placeholder="Enter session title"
                className="input-field"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type *
              </label>
              <select className="input-field" {...register("session_type")}>
                <option value="keynote">Keynote</option>
                <option value="workshop">Workshop</option>
                <option value="panel">Panel Discussion</option>
                <option value="talk">Technical Talk</option>
              </select>
            </div>

            {/* Date and Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  className="input-field"
                  {...register("date", { required: "Date is required" })}
                />
                {errors.date && <p className="error-text">{errors.date.message}</p>}
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot *
                </label>
                <input
                  type="time"
                  className="input-field"
                  {...register("time_slot", {
                    required: "Time is required",
                  })}
                />
                {errors.time_slot && (
                  <p className="error-text">{errors.time_slot.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                placeholder="Enter session location"
                className="input-field"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className="error-text">{errors.location.message}</p>
              )}
            </div>

            {/* Panel Members (for panel discussions) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Panel Members
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPanelMembers.includes(user.id)}
                      onChange={() => togglePanelMember(user.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">
                      {user.username} ({user.role})
                    </span>
                  </label>
                ))}
              </div>
              {users.length === 0 && (
                <p className="text-gray-500 text-sm">No users available</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/organiser/conferences/${conferenceId}`)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Session"
                  : "Create Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
