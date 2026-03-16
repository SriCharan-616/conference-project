import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usePaper, useUpdatePaperStatus } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/Badge";
import { Modal } from "../../components/Modal";

const STATUS_CHOICES = [
  { value: "submitted", label: "Submitted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: paper, isLoading } = usePaper(id);
  const updateStatusMutation = useUpdatePaperStatus();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const isAuthor = paper?.author.id === user?.id;
  const isOrganiser = user?.role === "organiser";
  const canUpdateStatus = isOrganiser && paper;

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        paperId: paper.id,
        status: newStatus,
      });

      toast.success("Paper status updated!");
      setShowStatusModal(false);
      setNewStatus("");
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-4xl">
          <div className="card p-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-4xl">
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">Paper not found</p>
            <button
              onClick={() => navigate("/author/papers")}
              className="btn-primary"
            >
              Back to Papers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submissionDate = new Date(paper.submission_date);
  const formattedDate = submissionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-4xl">
        {/* Header with Back Button */}
        <button
          onClick={() => navigate("/author/papers")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Papers
        </button>

        {/* Main Card */}
        <div className="card p-8">
          <div className="space-y-8">
            {/* Title and Status */}
            <div className="border-b pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {paper.title}
                  </h1>
                  <Badge status={paper.status} />
                </div>
                {canUpdateStatus && (
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="btn-primary"
                  >
                    Update Status
                  </button>
                )}
              </div>
            </div>

            {/* Author & Conference Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Author
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  {paper.author.username}
                </p>
                <p className="text-sm text-gray-600">{paper.author.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Conference
                </h3>
                <button
                  onClick={() => navigate(`/conferences/${paper.conference.id}`)}
                  className="text-lg font-medium text-blue-600 hover:text-blue-800"
                >
                  {paper.conference.title}
                </button>
                <p className="text-sm text-gray-600">
                  {new Date(paper.conference.start_date).getFullYear()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Submission Date
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Abstract */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Abstract
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {paper.abstract}
              </p>
            </div>

            {/* Paper File */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Paper Document
              </h2>
              {paper.file_url ? (
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </a>
              ) : (
                <p className="text-gray-500">No file attached</p>
              )}
            </div>

            {/* Status Timeline (if submitted) */}
            {paper.status !== "submitted" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Review History
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-800">
                    This paper was{" "}
                    <span className="font-semibold">{paper.status}</span> on{" "}
                    {formattedDate}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t flex gap-4">
              {isAuthor && paper.status === "submitted" && (
                <>
                  <button
                    onClick={() => navigate(`/author/papers/${paper.id}/edit`)}
                    className="btn-primary"
                  >
                    Edit Paper
                  </button>
                  <button className="btn-secondary">Withdraw Paper</button>
                </>
              )}

              <button
                onClick={() => navigate("/author/papers")}
                className="btn-secondary ml-auto"
              >
                Back to Papers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Paper Status"
      >
        <div className="space-y-4">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="input-field w-full"
          >
            <option value="">-- Select new status --</option>
            {STATUS_CHOICES.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updateStatusMutation.isPending}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
