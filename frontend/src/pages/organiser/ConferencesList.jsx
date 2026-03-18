import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConferences, useDeleteConference } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/Badge";

export default function OrganiserConferences() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: conferencesData, isLoading } = useConferences();
  const deleteConferenceMutation = useDeleteConference();
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter for user's own conferences
  const userConferences = conferencesData?.results?.filter(
    (conf) => conf?.organiser?.id === user?.id
  ) || [];

  const filteredConferences = userConferences.filter(
    (conf) => filterStatus === "all" || conf.status === filterStatus
  );

  const handleDelete = async (conferenceId) => {
    if (!window.confirm("Are you sure you want to delete this conference?")) {
      return;
    }

    try {
      await deleteConferenceMutation.mutateAsync(conferenceId);
      toast.success("Conference deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete conference");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 h-32 bg-gray-200 animate-pulse"></div>
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
            <h1 className="page-header mb-2">My Conferences</h1>
            <p className="page-subtitle">
              Manage and organize your conferences
            </p>
          </div>
          <button
            onClick={() => navigate("/organiser/conferences/new")}
            className="btn-primary"
          >
            + New Conference
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Total Conferences</p>
            <p className="text-3xl font-bold text-gray-900">
              {userConferences.length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {userConferences.filter((c) => c.status === "published").length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Draft</p>
            <p className="text-3xl font-bold text-yellow-600">
              {userConferences.filter((c) => c.status === "draft").length}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Total Registrations</p>
            <p className="text-3xl font-bold text-blue-600">
              {userConferences.reduce((sum, c) => sum + (c.registration_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="card p-4 mb-8">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Conferences Grid */}
        {filteredConferences.length > 0 ? (
          <div className="grid gap-6">
            {filteredConferences.map((conference) => (
              <div key={conference.id} className="card hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {conference.title}
                        </h2>
                        <Badge status={conference.status} />
                      </div>

                      <p className="text-gray-600 mb-4">{conference.theme}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Location</p>
                          <p className="font-semibold text-gray-900">
                            {conference.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(conference.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">End Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(conference.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Registrations</p>
                          <p className="font-semibold text-gray-900">
                            {conference.registration_count || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() =>
                          navigate(`/conferences/${conference.id}`)
                        }
                        className="btn-secondary"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/organiser/conferences/${conference.id}/edit`)
                        }
                        className="btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/organiser/conferences/${conference.id}/sessions`
                          )
                        }
                        className="btn-secondary"
                      >
                        Sessions
                      </button>
                      <button
                        onClick={() => handleDelete(conference.id)}
                        disabled={deleteConferenceMutation.isPending}
                        className="text-red-600 hover:text-red-800 py-2 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No conferences yet</p>
            <p className="text-gray-400 mb-6">
              Get started by creating your first conference
            </p>
            <button
              onClick={() => navigate("/organiser/conferences/new")}
              className="btn-primary"
            >
              Create Conference
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
