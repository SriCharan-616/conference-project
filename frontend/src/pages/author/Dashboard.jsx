import React from "react";
import { useNavigate } from "react-router-dom";
import { useMyPapers, useConferences, useMyRegistrations } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/Badge";

export default function AuthorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: papersData, isLoading: loadingPapers } = useMyPapers();
  const { data: conferencesData, isLoading: loadingConferences } =
    useConferences();
  const { data: registrationsData, isLoading: loadingRegistrations } =
    useMyRegistrations();

  const papers = papersData?.results || [];
  const conferences = conferencesData?.results || [];
  const registrations = registrationsData?.results || [];

  const stats = {
    submitted: papers.filter((p) => p.status === "submitted").length,
    accepted: papers.filter((p) => p.status === "accepted").length,
    rejected: papers.filter((p) => p.status === "rejected").length,
    registrations: registrations.length,
  };

  if (loadingPapers || loadingConferences || loadingRegistrations) {
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
            Manage your papers and conference registrations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Submitted Papers</p>
            <p className="text-4xl font-bold text-blue-600">{stats.submitted}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Accepted</p>
            <p className="text-4xl font-bold text-green-600">{stats.accepted}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Rejected</p>
            <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Registrations</p>
            <p className="text-4xl font-bold text-purple-600">
              {stats.registrations}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Papers */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Papers</h2>
              <button
                onClick={() => navigate("/author/papers")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {papers.length > 0 ? (
              <div className="space-y-4">
                {papers.slice(0, 3).map((paper) => (
                  <div
                    key={paper.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {paper.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(paper.submission_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge status={paper.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No papers submitted yet</p>
            )}

            <button
              onClick={() => navigate("/author/papers/submit")}
              className="btn-primary w-full mt-6"
            >
              Submit New Paper
            </button>
          </div>

          {/* Registrations */}
          <div className="card p-6">
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
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No conference registrations yet
              </p>
            )}

            <button
              onClick={() => navigate("/conferences")}
              className="btn-primary w-full mt-6"
            >
              Browse Conferences
            </button>
          </div>
        </div>

        {/* Upcoming Conferences */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upcoming Conferences
          </h2>
          {conferences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conferences.slice(0, 3).map((conf) => (
                <div
                  key={conf.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {conf.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {new Date(conf.start_date).toLocaleDateString()} -{" "}
                    {new Date(conf.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{conf.location}</p>
                  <button
                    onClick={() => navigate(`/conferences/${conf.id}`)}
                    className="btn-secondary w-full"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No conferences available</p>
          )}
        </div>
      </div>
    </div>
  );
}
