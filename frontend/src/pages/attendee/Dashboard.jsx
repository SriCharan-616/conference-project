import React from "react";
import { useNavigate } from "react-router-dom";
import { useConferences, useMyRegistrations } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/Badge";

export default function AttendeeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: conferencesData, isLoading: loadingConferences } =
    useConferences();
  const { data: registrationsData, isLoading: loadingRegistrations } =
    useMyRegistrations();

  const conferences = conferencesData?.results || [];
  const registrations = registrationsData?.results || [];

  const stats = {
    registrations: registrations.length,
    paid: registrations.filter((r) => r.payment_status === "paid").length,
    pending: registrations.filter((r) => r.payment_status === "pending").length,
    upcomingConferences: conferences.filter(
      (c) => new Date(c.start_date) > new Date()
    ).length,
  };

  if (loadingConferences || loadingRegistrations) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.username}!
          </h1>
          <p className="text-gray-600">
            Discover and register for amazing conferences
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">My Registrations</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.registrations}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Paid</p>
            <p className="text-4xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Payment</p>
            <p className="text-4xl font-bold text-orange-600">
              {stats.pending}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Upcoming Conferences</p>
            <p className="text-4xl font-bold text-purple-600">
              {stats.upcomingConferences}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* My Registrations */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                My Registrations
              </h2>
              <button
                onClick={() => navigate("/attendee/registrations")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.slice(0, 3).map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {reg.conference.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          reg.registration_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge status={reg.payment_status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  No registrations yet
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

          {/* Payment Summary */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Payment Summary
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.paid}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
            </div>

            {stats.pending > 0 && (
              <button
                onClick={() => navigate("/attendee/registrations")}
                className="btn-primary w-full mt-6"
              >
                Complete Payments
              </button>
            )}
          </div>
        </div>

        {/* Upcoming Conferences */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Featured Conferences
            </h2>
            <button
              onClick={() => navigate("/conferences")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {conferences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conferences.slice(0, 3).map((conf) => {
                const isRegistered = registrations.some(
                  (r) => r.conference.id === conf.id
                );
                return (
                  <div
                    key={conf.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {conf.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {conf.theme}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        📍 {conf.location}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        📅{" "}
                        {new Date(conf.start_date).toLocaleDateString()} -{" "}
                        {new Date(conf.end_date).toLocaleDateString()}
                      </p>

                      {isRegistered ? (
                        <button
                          onClick={() =>
                            navigate(`/conferences/${conf.id}`)
                          }
                          className="btn-secondary w-full"
                        >
                          View Registration
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/conferences/${conf.id}/register`)
                          }
                          className="btn-primary w-full"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No conferences available</p>
          )}
        </div>
      </div>
    </div>
  );
}
