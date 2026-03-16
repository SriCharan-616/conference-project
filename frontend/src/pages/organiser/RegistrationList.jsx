import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrations } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";

export default function RegistrationList() {
  const navigate = useNavigate();
  const { data: registrationsData, isLoading } = useRegistrations();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const registrations = registrationsData?.results || [];

  const filteredRegistrations = registrations.filter((reg) => {
  const query = searchQuery.toLowerCase();

  const matchesStatus =
    filterStatus === "all" || reg.payment_status === filterStatus;

  const matchesSearch =
    reg.user?.username?.toLowerCase().includes(query) ||
    reg.user?.email?.toLowerCase().includes(query) ||
    reg.conference?.title?.toLowerCase().includes(query);

  return matchesStatus && matchesSearch;
});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 h-20 bg-gray-200 animate-pulse"></div>
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
            <h1 className="page-header mb-2">Conference Registrations</h1>
            <p className="page-subtitle">
              Manage and track attendee registrations
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by name, email, or conference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Filter by Payment Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-4">
          {filteredRegistrations.length > 0 ? (
            filteredRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="card p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {registration.user.username}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        Email: {registration.user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Conference:{" "}
                        <button
                          onClick={() =>
                            navigate(
                              `/conferences/${registration.conference.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {registration.conference.title}
                        </button>
                      </p>
                      <p className="text-sm text-gray-600">
                        Registered:{" "}
                        {new Date(
                          registration.registration_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase">
                        Payment Status
                      </p>
                      <Badge status={registration.payment_status} />
                    </div>
                    {registration.amount_paid > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase">Amount</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{registration.amount_paid}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/organiser/registrations/${registration.id}`)
                      }
                      className="btn-secondary whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No registrations found</p>
              <p className="text-gray-400">
                Registrations will appear here once attendees start registering
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredRegistrations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-900">
                {registrations.length}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Pending Payment</p>
              <p className="text-3xl font-bold text-orange-600">
                {registrations.filter((r) => r.payment_status === "pending")
                  .length}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {registrations.filter((r) => r.payment_status === "paid").length}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹
                {registrations
                  .filter((r) => r.payment_status === "paid")
                  .reduce((sum, r) => sum + (r.amount_paid || 0), 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
