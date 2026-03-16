import React from "react";
import { useNavigate } from "react-router-dom";
import { useConferences, useRegistrations, usePayments } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";

export default function OrganiserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: conferencesData, isLoading: loadingConferences } =
    useConferences();
  const { data: registrationsData, isLoading: loadingRegistrations } =
    useRegistrations();
  const { data: paymentsData, isLoading: loadingPayments } = usePayments();

  const conferences = conferencesData?.results?.filter(
    (c) => c.organiser.id === user?.id
  ) || [];
  const registrations = registrationsData?.results || [];
  const payments = paymentsData?.results || [];

  const stats = {
    conferences: conferences.length,
    registrations: registrations.length,
    totalRevenue: payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingPayments: payments.filter((p) => p.status === "pending").length,
  };

  if (loadingConferences || loadingRegistrations || loadingPayments) {
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
            Manage your conferences, registrations, and payments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Total Conferences</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.conferences}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Registrations</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.registrations}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-emerald-600">
              ₹{stats.totalRevenue}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Payments</p>
            <p className="text-4xl font-bold text-orange-600">
              {stats.pendingPayments}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Conferences */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Conferences</h2>
              <button
                onClick={() => navigate("/organiser/conferences")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {conferences.length > 0 ? (
              <div className="space-y-4">
                {conferences.slice(0, 3).map((conf) => (
                  <div
                    key={conf.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <p className="font-semibold text-gray-900">{conf.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(conf.start_date).toLocaleDateString()} -{" "}
                      {new Date(conf.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No conferences yet</p>
            )}

            <button
              onClick={() => navigate("/organiser/conferences/new")}
              className="btn-primary w-full mt-6"
            >
              Create Conference
            </button>
          </div>

          {/* Recent Registrations */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Registrations
              </h2>
              <button
                onClick={() => navigate("/organiser/registrations")}
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
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <p className="font-semibold text-gray-900">
                      {reg.user.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reg.conference.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No registrations yet
              </p>
            )}

            <button
              onClick={() => navigate("/organiser/registrations")}
              className="btn-secondary w-full mt-6"
            >
              Manage Registrations
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/organiser/conferences/new")}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-blue-900">Create Conference</p>
              <p className="text-sm text-blue-700">Start a new conference</p>
            </button>

            <button
              onClick={() => navigate("/organiser/registrations")}
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-green-900">View Registrations</p>
              <p className="text-sm text-green-700">Manage attendees</p>
            </button>

            <button
              onClick={() => navigate("/organiser/payments")}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-purple-900">Payment Tracking</p>
              <p className="text-sm text-purple-700">View all payments</p>
            </button>

            <button
              onClick={() => navigate("/conferences")}
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-orange-900">Browse Conferences</p>
              <p className="text-sm text-orange-700">Explore other events</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
