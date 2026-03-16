import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "attendee",
    },
  });

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      toast.success("Registration successful!");
      // Redirect based on role
      const roleRoutes = {
        admin: "/admin",
        organiser: "/organiser",
        author: "/author",
        attendee: "/attendee",
      };
      navigate(roleRoutes[result.user.role] || "/");
    } else {
      toast.error(result.error);
    }
  };

  const roleDescriptions = {
    admin: "Platform administrator - manage users and system",
    organiser: "Conference organiser - create and manage conferences",
    author: "Paper author - submit papers to conferences",
    attendee: "Conference attendee - register and attend conferences",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="card p-8">
          <h1 className="page-header text-center mb-1">Create Account</h1>
          <p className="page-subtitle text-center mb-8">Join our conference management platform</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "attendee", label: "Attendee" },
                  { value: "author", label: "Author" },
                  { value: "organiser", label: "Organiser" },
                  { value: "admin", label: "Admin" },
                ].map((role) => (
                  <label
                    key={role.value}
                    className="relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      value={role.value}
                      {...register("role")}
                      className="mt-1"
                    />
                    <span className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        {role.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {roleDescriptions[role.value]}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="input-field"
                  {...register("first_name")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="input-field"
                  {...register("last_name")}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="johndoe"
                className="input-field"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />
              {errors.username && <p className="error-text">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-field"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="input-field"
                {...register("phone")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register("password_confirm", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              {errors.password_confirm && (
                <p className="error-text">{errors.password_confirm.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
