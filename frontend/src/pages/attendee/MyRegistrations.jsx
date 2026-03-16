import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyRegistrations } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";

export default function MyRegistrations() {
  const navigate = useNavigate();
  const { data: registrationsData, isLoading } = useMyRegistrations();
  const [filterStatus, setFilterStatus] = useState("all");

  const registrations = registrationsData || [];

  const filteredRegistrations = registrations.filter(
    (reg) => filterStatus === "all" || reg.payment_status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 h-24 bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-header mb-2">My Registrations</h1>
            <p className="page-subtitle">
              View your conference registrations and payments
            </p>
          </div>
          <button
            onClick={() => navigate("/conferences")}
            className="btn-primary"
          >
            Browse Conferences
          </button>
        </div>

        {/* Filter */}
        <div className="card p-4 mb-8">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Registrations List */}
        {filteredRegistrations.length > 0 ? (
          <div className="space-y-6">
            {filteredRegistrations.map((registration) => (
              <div key={registration.id} className="card overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Conference Info */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {registration.conference.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {registration.conference.theme}
                      </p>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-semibold text-gray-700">
                            Location:
                          </span>{" "}
                          {registration.conference.location}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Dates:
                          </span>{" "}
                          {new Date(
                            registration.conference.start_date
                          ).toLocaleDateString()}{" "}
                          to{" "}
                          {new Date(
                            registration.conference.end_date
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">
                            Registered:
                          </span>{" "}
                          {new Date(
                            registration.registration_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                          Payment Status
                        </h3>
                        <Badge status={registration.payment_status} />
                      </div>

                      {registration.amount_paid > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">Amount Paid:</p>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{registration.amount_paid}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-4">
                        {registration.payment_status === "pending" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/attendee/registrations/${registration.id}/payment`
                              )
                            }
                            className="btn-primary"
                          >
                            Complete Payment
                          </button>
                        )}
                        <button
                          onClick={() =>
                            navigate(`/conferences/${registration.conference.id}`)
                          }
                          className="btn-secondary"
                        >
                          View Conference
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
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
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No registrations yet</p>
            <p className="text-gray-400 mb-6">
              Start by browsing and registering for conferences
            </p>
            <button
              onClick={() => navigate("/conferences")}
              className="btn-primary"
            >
              Browse Conferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
