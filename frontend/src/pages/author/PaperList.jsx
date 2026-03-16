import React from "react";
import { useNavigate } from "react-router-dom";
import { useMyPapers } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";

export default function PaperList() {
  const navigate = useNavigate();
  const { data: papersData, isLoading } = useMyPapers();

  const papers = papersData?.results || papersData || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-lg"></div>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="page-header">My Papers</h1>
            <p className="page-subtitle">View and manage your paper submissions</p>
          </div>
          <button
            onClick={() => navigate("/author/papers/submit")}
            className="btn-primary mt-4 md:mt-0"
          >
            + Submit New Paper
          </button>
        </div>

        {/* Papers Table */}
        {papers.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">No papers submitted yet</p>
            <button
              onClick={() => navigate("/author/papers/submit")}
              className="btn-primary"
            >
              Submit Your First Paper
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Conference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submitted
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {papers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {paper.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {paper.conference_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={paper.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(paper.submission_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/papers/${paper.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
