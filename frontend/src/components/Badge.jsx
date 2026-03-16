import React from "react";

export const Badge = ({ status, label = null }) => {
  const statusConfig = {
    // Paper statuses
    submitted: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
    accepted: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
    rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },

    // Payment statuses
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    paid: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },

    // Conference statuses
    draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
    published: { bg: "bg-blue-100", text: "text-blue-800", label: "Published" },

    // User statuses
    active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
    inactive: { bg: "bg-gray-100", text: "text-gray-800", label: "Inactive" },

    // Role badges
    admin: { bg: "bg-purple-100", text: "text-purple-800", label: "Admin" },
    organiser: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Organiser" },
    author: { bg: "bg-blue-100", text: "text-blue-800", label: "Author" },
    attendee: { bg: "bg-cyan-100", text: "text-cyan-800", label: "Attendee" },
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: status,
  };

  return (
    <span className={`badge ${config.bg} ${config.text}`}>
      {label || config.label}
    </span>
  );
};
