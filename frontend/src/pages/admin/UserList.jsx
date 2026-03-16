import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";

const ROLE_COLORS = {
  admin: "bg-red-100 text-red-800",
  organiser: "bg-blue-100 text-blue-800",
  author: "bg-purple-100 text-purple-800",
  attendee: "bg-green-100 text-green-800",
};

export default function UserList() {
  const navigate = useNavigate();
  const { data: usersData, isLoading } = useUsers();
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const users = usersData?.results || [];

  const filteredUsers = users
    .filter((user) => filterRole === "all" || user.role === filterRole)
    .filter((user) => filterStatus === "all" || user.status === filterStatus)
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
            <h1 className="page-header mb-2">User Management</h1>
            <p className="page-subtitle">Manage system users and permissions</p>
          </div>
          <button onClick={() => navigate("/admin/users/new")} className="btn-primary">
            + New User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Admins</p>
            <p className="text-3xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Organisers</p>
            <p className="text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === "organiser").length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Authors</p>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter((u) => u.role === "author").length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Attendees</p>
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.role === "attendee").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Filter by Role */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="organiser">Organiser</option>
                <option value="author">Author</option>
                <option value="attendee">Attendee</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-700">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {user.username}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            ROLE_COLORS[user.role]
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={user.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
