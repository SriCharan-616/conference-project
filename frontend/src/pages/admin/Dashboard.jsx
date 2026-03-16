import React from "react";
import { useNavigate } from "react-router-dom";
import { useUsers, useConferences } from "../../hooks/useAPI";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: usersData, isLoading: loadingUsers } = useUsers();
  const { data: conferencesData, isLoading: loadingConferences } =
    useConferences();

  const users = usersData?.results || [];
  const conferences = conferencesData?.results || [];

  const stats = {
    totalUsers: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    organisers: users.filter((u) => u.role === "organiser").length,
    authors: users.filter((u) => u.role === "author").length,
    attendees: users.filter((u) => u.role === "attendee").length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalConferences: conferences.length,
    publishedConferences: conferences.filter((c) => c.status === "published")
      .length,
  };

  if (loadingUsers || loadingConferences) {
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
            System Administration
          </h1>
          <p className="text-gray-600">
            Monitor and manage the Conference Management System
          </p>
        </div>

        {/* User Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Admins</p>
              <p className="text-3xl font-bold text-red-600">{stats.admins}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Organisers</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.organisers}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Authors</p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.authors}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Attendees</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.attendees}
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Active</p>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.activeUsers}
              </p>
            </div>
          </div>
        </div>

        {/* Conference Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Conference Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-2">Total Conferences</p>
              <p className="text-4xl font-bold text-gray-900">
                {stats.totalConferences}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-2">Published</p>
              <p className="text-4xl font-bold text-green-600">
                {stats.publishedConferences}
              </p>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Management */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {users.length > 0 ? (
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "organiser"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "author"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users yet</p>
            )}

            <button
              onClick={() => navigate("/admin/users")}
              className="btn-primary w-full mt-6"
            >
              Manage Users
            </button>
          </div>

          {/* System Status */}
          <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Status</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Database</p>
                  <p className="text-sm text-gray-600">PostgreSQL</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">API Server</p>
                  <p className="text-sm text-gray-600">Django REST Framework</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">File Storage</p>
                  <p className="text-sm text-gray-600">Supabase Storage</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-blue-900">User Management</p>
              <p className="text-sm text-blue-700">Manage system users</p>
            </button>

            <button
              onClick={() => navigate("/conferences")}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-purple-900">View Conferences</p>
              <p className="text-sm text-purple-700">Browse all conferences</p>
            </button>

            <button
              onClick={() => navigate("/admin/settings")}
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-orange-900">System Settings</p>
              <p className="text-sm text-orange-700">Configure system</p>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition"
            >
              <p className="font-semibold text-green-900">My Profile</p>
              <p className="text-sm text-green-700">Admin settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
