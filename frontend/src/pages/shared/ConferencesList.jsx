import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConferences, useMyRegistrations } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";
import { useAuth } from "../../hooks/useAuth";

export default function ConferencesList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: conferencesData, isLoading, error } = useConferences(1, filters);
  const { data: registrationsData } = useMyRegistrations();

  const conferences = conferencesData?.results || [];
  const registrations = registrationsData || [];

  // Create a quick lookup set of registered conference IDs
  const registeredConferenceIds = new Set(
    registrations.map((reg) => reg.conference.id)
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ search: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="container-custom text-center">
          <p className="text-red-600">Failed to load conferences</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="page-header">Conferences</h1>
            <p className="page-subtitle">Browse and register for conferences</p>
          </div>

          {user?.role === "organiser" && (
            <button
              onClick={() => navigate("/organiser/conferences/new")}
              className="btn-primary mt-4 md:mt-0"
            >
              + Create Conference
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title, location..."
            className="input-field"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Conferences Grid */}
        {conferences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No conferences found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conferences.map((conference) => {
              const isRegistered = registeredConferenceIds.has(conference.id);

              return (
                <div
                  key={conference.id}
                  className="card p-6 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate(`/conference/${conference.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {conference.title}
                    </h3>

                    <div className="flex gap-2">
                      <Badge status={conference.status} />

                      {isRegistered && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          Registered
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    📍 {conference.location}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>
                      📅{" "}
                      {new Date(conference.start_date).toLocaleDateString()}
                    </p>
                    <p>👤 Organiser: {conference.organiser_name}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/conferences/${conference.id}`);
                    }}
                    className="btn-primary w-full text-sm"
                  >
                    {isRegistered ? "View Registration" : "View Details"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}