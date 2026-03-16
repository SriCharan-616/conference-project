import React, { useState } from "react";
import { usePayments } from "../../hooks/useAPI";
import { Badge } from "../../components/Badge";

const PAYMENT_METHODS = {
  card: "Credit/Debit Card",
  upi: "UPI",
  netbanking: "Net Banking",
  cash: "Cash",
};

export default function PaymentList() {
  const { data: paymentsData, isLoading } = usePayments();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const payments = paymentsData?.results || [];

  const filteredPayments = payments
    .filter((payment) => filterStatus === "all" || payment.status === filterStatus)
    .filter(
      (payment) =>
        filterMethod === "all" || payment.method === filterMethod
    )
    .filter((payment) =>
      payment.registration.user.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.registration.user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (payment.transaction_id &&
        payment.transaction_id.includes(searchQuery))
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 h-20 bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === "completed").length,
    pending: payments.filter((p) => p.status === "pending").length,
    totalAmount: payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-header mb-2">Payment Management</h1>
            <p className="page-subtitle">Track and manage conference payments</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Total Payments</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">₹{stats.totalAmount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by name, email, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Filter by Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Filter by Method */}
            <div>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="input-field"
              >
                <option value="all">All Payment Methods</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        {filteredPayments.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Conference
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.registration.user.username}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payment.registration.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {payment.registration.conference.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">
                          ₹{payment.amount}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {PAYMENT_METHODS[payment.method] || payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {payment.payment_date
                            ? new Date(payment.payment_date).toLocaleDateString()
                            : "—"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No payments found</p>
            <p className="text-gray-400">
              Payments will appear here once attendees complete their transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
