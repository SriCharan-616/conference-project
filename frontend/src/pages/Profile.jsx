import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      // TODO: Call updateProfile API
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleChangePassword = () => {
    navigate("/profile/change-password");
  };

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        <h1 className="page-header mb-2">Profile Settings</h1>
        <p className="page-subtitle mb-8">Manage your account information</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-blue-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {user.username}
                </h2>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded capitalize">
                  {user.role}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleChangePassword}
                  className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2 border-b"
                >
                  Change Password
                </button>
                <button
                  onClick={() => navigate("/profile/notifications")}
                  className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2 border-b"
                >
                  Notifications
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left text-sm text-red-600 hover:text-red-800 py-2 border-b"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="md:col-span-2">
            <div className="card p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
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
                    Email Address
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
                  {errors.email && (
                    <p className="error-text">{errors.email.message}</p>
                  )}
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

                {/* Account Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Account Status:</span>{" "}
                    <span className="capitalize font-medium">
                      {user.status}
                    </span>
                  </p>
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Member Since:</span>{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Last Updated:</span>{" "}
                    {new Date(user.updated_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
