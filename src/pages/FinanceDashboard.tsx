import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Filter,
  Calendar,
  CreditCard,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Send,
} from "lucide-react";

const ExpenseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    vendor: "",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const categories = [
    "Operations",
    "IT Infrastructure",
    "Marketing",
    "Human Resources",
    "Travel",
    "Office Supplies",
    "Professional Services",
    "Utilities",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.vendor ||
      !formData.amount ||
      !formData.category ||
      !formData.description
    ) {
      return;
    }

    const newExpense = {
      id: `PAY-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      vendor: formData.vendor,
      amount: parseFloat(formData.amount),
      category: formData.category,
      submittedBy: "Current User",
      submittedDate: formData.date,
      description: formData.description,
      status: "pending",
    };

    onSubmit(newExpense);

    // Reset form
    setFormData({
      vendor: "",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor / Payee *
          </label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) =>
              setFormData({ ...formData, vendor: e.target.value })
            }
            placeholder="Enter vendor name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter expense description or notes"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Payment Request
        </button>
      </div>
    </form>
  );
};

const FinanceDashboard = () => {
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [reportType, setReportType] = useState("variance");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notification, setNotification] = useState(null);

  // Mock data
  const kpiData = {
    totalBudget: 500000,
    utilized: 342500,
    pending: 45000,
    monthlySpend: 85000,
    approved: 297500,
  };

  const pendingPayments = [
    {
      id: "PAY-001",
      vendor: "Office Supplies Co.",
      amount: 12500,
      category: "Operations",
      submittedBy: "John Doe",
      submittedDate: "2025-11-15",
      description: "Q4 office supplies and equipment",
      status: "pending",
    },
    {
      id: "PAY-002",
      vendor: "Tech Solutions Inc.",
      amount: 25000,
      category: "IT Infrastructure",
      submittedBy: "Jane Smith",
      submittedDate: "2025-11-14",
      description: "Server maintenance and upgrades",
      status: "pending",
    },
    {
      id: "PAY-003",
      vendor: "Marketing Agency",
      amount: 7500,
      category: "Marketing",
      submittedBy: "Mike Johnson",
      submittedDate: "2025-11-16",
      description: "Social media campaign Q4",
      status: "pending",
    },
  ];

  const [payments, setPayments] = useState(pendingPayments);

  const utilizationPercentage = (kpiData.utilized / kpiData.totalBudget) * 100;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = (payment, approved) => {
    setPayments(
      payments.map((p) =>
        p.id === payment.id
          ? { ...p, status: approved ? "approved" : "rejected" }
          : p
      )
    );
    showNotification(
      `Payment ${payment.id} ${
        approved ? "approved" : "rejected"
      } successfully`,
      "success"
    );
    setApprovalModalVisible(false);
    setSelectedPayment(null);
  };

  const handleGenerateReport = () => {
    if (!startDate || !endDate || !reportType) {
      showNotification("Please select report type and date range", "warning");
      return;
    }
    showNotification(`Generating ${reportType} report...`, "info");
    setTimeout(() => {
      showNotification("Report ready for download", "success");
    }, 1500);
  };

  const handleExportReport = () => {
    showNotification("Exporting report to CSV...", "success");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === "ALL") return true;
    return payment.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : notification.type === "warning"
                ? "bg-yellow-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Finance Dashboard
          </h1>
          <p className="text-gray-600">
            Full Access - View overall financial KPIs and manage approvals
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${kpiData.totalBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Budget</div>
          </div> */}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">
                {utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${kpiData.utilized.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Approved Budgets</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${kpiData.pending.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-green-600" />
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${kpiData.monthlySpend.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Spend</div>
          </div>
        </div>

        {/* Budget Reports Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Budget Reports</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Generate budget variance and expenditure reports
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="variance">Budget Variance Report</option>
                <option value="expenditure">Expenditure Report</option>
                <option value="summary">Summary Report</option>
                <option value="forecast">Forecast Report</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleGenerateReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Report
            </button>
            <button
              onClick={handleExportReport}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Expense Tracker Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Expense Tracker</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Input financial transactions and submit payment requests
          </p>

          <ExpenseForm
            onSubmit={(expense) => {
              setPayments([...payments, expense]);
              showNotification(
                `Payment request ${expense.id} submitted successfully`,
                "success"
              );
            }}
          />
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">
                Pending Approvals
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPayments.map((payment) => {
              const isExpanded = expandedPayment === payment.id;

              return (
                <div
                  key={payment.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      setExpandedPayment(isExpanded ? null : payment.id)
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {payment.id}
                          </span>
                          <span className="text-xs text-gray-500">
                            {payment.vendor}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">
                              ${payment.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{payment.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{payment.submittedDate}</span>
                          </div>
                        </div>
                      </div>

                      <button className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-white">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600">
                            {payment.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                            Submitted By
                          </h4>
                          <p className="text-sm text-gray-600">
                            {payment.submittedBy}
                          </p>
                        </div>

                        {payment.status === "pending" && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(payment, true);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPayment(payment);
                                setApprovalModalVisible(true);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No payments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {approvalModalVisible && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Action
              </h3>

              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  Are you sure you want to process this payment?
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm">
                    <span className="font-medium">Payment ID:</span>{" "}
                    {selectedPayment.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Vendor:</span>{" "}
                    {selectedPayment.vendor}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span> $
                    {selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setApprovalModalVisible(false);
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedPayment, false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedPayment, true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
