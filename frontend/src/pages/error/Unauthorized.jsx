import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">403</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 text-lg">
            You don't have permission to access this page
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 border border-red-200">
          <p className="text-sm text-gray-600 mb-2">Your current role:</p>
          <p className="text-xl font-semibold text-red-600 capitalize">
            {user?.role || "Guest"}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary w-full"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/conferences")}
            className="btn-primary w-full"
          >
            Back to Conferences
          </button>
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 w-full py-2"
            >
              Sign In with Different Account
            </button>
          )}
        </div>

        <p className="text-gray-500 text-sm mt-8">
          If you believe this is an error, please contact support
        </p>
      </div>
    </div>
  );
}
