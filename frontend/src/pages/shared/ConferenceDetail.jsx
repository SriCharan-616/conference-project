import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConference, useSessionsByConference } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../hooks/useAuth";

export default function ConferenceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { data: conference, isLoading: conferenceLoading } = useConference(id);
  const { data: sessionsData, isLoading: sessionsLoading } = useSessionsByConference(id);

  if (conferenceLoading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!conference)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Conference not found</p>
      </div>
    );

  const sessions = sessionsData || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => navigate("/conferences")}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2"
        >
          ← Back to Conferences
        </button>

        {/* Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="page-header mb-2">{conference.title}</h1>
              <p className="text-gray-600 mb-4">{conference.theme}</p>
              <div className="flex flex-wrap gap-4">
                <Badge status={conference.status} />
              </div>
            </div>
            {user?.role === "organiser" && conference.organiser.id === user.id && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => navigate(`/organiser/conferences/${id}/edit`)}
                  className="btn-primary"
                >
                  Edit
                </button>
                <button className="btn-secondary">Delete</button>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dates</h3>
              <p className="text-gray-600">
                {new Date(conference.start_date).toLocaleDateString()} -{" "}
                {new Date(conference.end_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{conference.location}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Submission Deadline</h3>
              <p className="text-gray-600">
                {new Date(conference.submission_deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Organiser</h3>
              <p className="text-gray-600">{conference.organiser.get_full_name}</p>
            </div>
          </div>

          {/* Register Button */}
          {user && user.role !== "organiser" && (
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn-primary w-full md:w-auto"
            >
              Register Now
            </button>
          )}
        </div>

        {/* Sessions */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sessions</h2>

          {sessionsLoading ? (
            <p>Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-500">No sessions scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {session.date} @ {session.time_slot}
                      </p>
                      <p className="text-sm text-gray-600">📍 {session.location}</p>
                      <Badge status={session.session_type} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        title="Confirm Registration"
        onClose={() => setShowRegisterModal(false)}
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                navigate(`/conferences/${id}/register`);
              }}
              className="btn-primary"
            >
              Proceed to Registration
            </button>
          </>
        }
      >
        <p className="text-gray-700">
          You are about to register for <strong>{conference.title}</strong>. Continue?
        </p>
      </Modal>
    </div>
  );
}
