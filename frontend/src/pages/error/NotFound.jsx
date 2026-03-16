import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg">
            The page you're looking for doesn't exist or has been moved
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 text-sm">
            Check the URL and try again, or use the navigation below
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
            onClick={() => navigate("/")}
            className="btn-primary w-full"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate("/conferences")}
            className="text-blue-600 hover:text-blue-800 w-full py-2"
          >
            Browse Conferences
          </button>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-gray-500 text-sm">Common pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => navigate("/conferences")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Conferences
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate("/author/papers")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Papers
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
