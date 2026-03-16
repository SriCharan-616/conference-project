import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUser, useUpdateUser } from "../../hooks/useAPI";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: user, isLoading } = useUser(id, { enabled: isEdit });
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      role: "attendee",
      status: "active",
      phone: "",
    },
  });

  useEffect(() => {
    if (isEdit && user) {
      reset({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone || "",
      });
    }
  }, [user, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateUserMutation.mutateAsync({
          id,
          ...data,
        });
        toast.success("User updated successfully!");
      }
      navigate("/admin/users");
    } catch (error) {
      toast.error(error.message || "Failed to save user");
    }
  };

  if (isEdit && isLoading) {
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

  if (isEdit && !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">User not found</p>
            <button
              onClick={() => navigate("/admin/users")}
              className="btn-primary"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/users")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Users
        </button>

        <h1 className="page-header mb-2">Edit User</h1>
        <p className="page-subtitle mb-8">Update user profiles and permissions</p>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                className="input-field"
                readOnly
                {...register("username")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Username cannot be changed
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className="input-field"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="input-field"
                {...register("phone")}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select className="input-field" {...register("role")}>
                <option value="admin">Admin</option>
                <option value="organiser">Organiser</option>
                <option value="author">Author</option>
                <option value="attendee">Attendee</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select className="input-field" {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* User Info (Read-only) */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {new Date(user.updated_at).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || updateUserMutation.isPending}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isSubmitting || updateUserMutation.isPending
                  ? "Saving..."
                  : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
