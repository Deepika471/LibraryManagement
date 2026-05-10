// src/pages/admin/IssueBooks.jsx
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { CheckCircle2, AlertCircle } from "lucide-react";

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  requested:        { label: "Requested",      color: "bg-amber-100 text-amber-700 border-amber-200"       },
  approved:         { label: "Issued",         color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  return_requested: { label: "Return Pending", color: "bg-blue-100 text-blue-700 border-blue-200"          },
  returned:         { label: "Returned",       color: "bg-gray-100 text-gray-500 border-gray-200"          },
  rejected:         { label: "Rejected",       color: "bg-red-100 text-red-600 border-red-200"             },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-500" };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const color = type === "error" ? "bg-red-600" : type === "warning" ? "bg-amber-500" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${color}`}>
      {type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
};

// ── Loading Skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="p-6 space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {[2, 2, 2, 1, 1, 1, 1, 1].map((flex, j) => (
          <div key={j} className="h-4 bg-slate-200 rounded animate-pulse" style={{ flex }} />
        ))}
      </div>
    ))}
  </div>
);

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <svg className="w-14 h-14 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p className="text-sm">{message}</p>
  </div>
);

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "all",              label: "All"            },
  { id: "requested",        label: "Pending"        },
  { id: "approved",         label: "Issued"         },
  { id: "return_requested", label: "Return Pending" },
  { id: "returned",         label: "Returned"       },
  { id: "rejected",         label: "Rejected"       },
];

// ── Main Component ───────────────────────────────────────────────────────────
export default function IssueBooks() {
  const [issues,   setIssues]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search,   setSearch]   = useState("");
  const [toast,    setToast]    = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/issues/all");
      setIssues(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to fetch issue requests", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  // ── Admin actions ──────────────────────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/issues/approve/${id}`);
      showToast("Request approved. Book issued for 14 days.");
      fetchIssues();
    } catch (err) {
      showToast(err.response?.data?.message || "Approval failed", "error");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this book request?")) return;
    try {
      await axiosInstance.put(`/issues/reject/${id}`);
      showToast("Request rejected.", "warning");
      fetchIssues();
    } catch (err) {
      showToast(err.response?.data?.message || "Rejection failed", "error");
    }
  };

  const handleConfirmReturn = async (id) => {
    try {
      const res = await axiosInstance.put(`/issues/confirm-return/${id}`);
      const fee = res.data.lateFee;
      if (fee > 0) {
        showToast(`Return confirmed. Late fee of ₹${fee} added to user.`, "warning");
      } else {
        showToast("Return confirmed successfully. No late fee!");
      }
      fetchIssues();
    } catch (err) {
      showToast(err.response?.data?.message || "Return confirmation failed", "error");
    }
  };

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filtered = issues
    .filter((issue) => activeTab === "all" || issue.status === activeTab)
    .filter((issue) => {
      const q = search.toLowerCase();
      return (
        issue.user?.username?.toLowerCase().includes(q) ||
        issue.user?.email?.toLowerCase().includes(q) ||
        issue.book?.title?.toLowerCase().includes(q)
      );
    });

  // ── Tab counts ─────────────────────────────────────────────────────────────
  const countFor = (tabId) =>
    tabId === "all"
      ? issues.length
      : issues.filter((i) => i.status === tabId).length;

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Issue Management</h1>
        <p className="text-slate-500 mt-1 text-sm">Approve requests, confirm returns, and track all issues</p>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending Requests", value: countFor("requested"),        color: "text-amber-600"   },
          { label: "Currently Issued", value: countFor("approved"),         color: "text-emerald-600" },
          { label: "Return Pending",   value: countFor("return_requested"), color: "text-blue-600"    },
          { label: "Total Returned",   value: countFor("returned"),         color: "text-slate-600"   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs + Search ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {countFor(tab.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search user or book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white w-64"
          />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState message={
            search
              ? `No results for "${search}"`
              : activeTab === "all"
              ? "No issue records yet."
              : `No ${activeTab.replace("_", " ")} records.`
          } />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Book</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Issue Date</th>
                  <th className="px-6 py-3 text-left">Due Date</th>
                  <th className="px-6 py-3 text-left">Late Fee</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((issue) => {
                  const isOverdue =
                    issue.dueDate &&
                    issue.status === "approved" &&
                    new Date(issue.dueDate) < new Date();

                  return (
                    <tr
                      key={issue._id}
                      className={`hover:bg-slate-50 transition-colors ${isOverdue ? "bg-red-50" : ""}`}
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{issue.user?.username || "—"}</p>
                        <p className="text-xs text-slate-400">{issue.user?.email}</p>
                      </td>

                      {/* Book */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{issue.book?.title || "—"}</p>
                        <p className="text-xs text-slate-400">{issue.book?.author}</p>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          issue.book?.type === "digital"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {issue.book?.type || "physical"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={issue.status} />
                        {isOverdue && (
                          <span className="ml-1 text-xs text-red-600 font-bold">⚠ Overdue</span>
                        )}
                      </td>

                      {/* Issue Date */}
                      <td className="px-6 py-4 text-slate-600">
                        {issue.issueDate
                          ? new Date(issue.issueDate).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Due Date */}
                      <td className={`px-6 py-4 ${isOverdue ? "text-red-600 font-semibold" : "text-slate-600"}`}>
                        {issue.dueDate
                          ? new Date(issue.dueDate).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Late Fee */}
                      <td className="px-6 py-4">
                        {issue.lateFee > 0 ? (
                          <span className="text-red-600 font-semibold">₹{issue.lateFee}</span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {issue.status === "requested" && (
                            <>
                              <button
                                onClick={() => handleApprove(issue._id)}
                                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(issue._id)}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {issue.status === "return_requested" && (
                            <button
                              onClick={() => handleConfirmReturn(issue._id)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Confirm Return
                            </button>
                          )}

                          {(issue.status === "approved" ||
                            issue.status === "returned" ||
                            issue.status === "rejected") && (
                            <span className="text-slate-400 text-xs">No action</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// //IssueBooks.jsx
// import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";

// export default function IssueBooks() {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchIssues = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("/issues/all");
//       setIssues(res.data);
//     } catch (err) {
//       console.error("Failed to fetch issues:", err.response?.data || err.message);
//       alert("Error fetching issue requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//   }, []);

//   // ✅ Approve Book Request
//   const handleApprove = async (id) => {
//     try {
//       await axiosInstance.put(`/issues/approve/${id}`);
//       fetchIssues();
//     } catch (err) {
//       alert(err.response?.data?.message || "Approval failed");
//     }
//   };

//   // ✅ Confirm Physical Return
//   const handleConfirmReturn = async (id) => {
//     try {
//       await axiosInstance.put(`/issues/confirm-return/${id}`);
//       fetchIssues();
//     } catch (err) {
//       alert(err.response?.data?.message || "Return confirmation failed");
//     }
//   };

//   // 🎨 Status Styling
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-700";
//       case "returned":
//         return "bg-blue-100 text-blue-700";
//       case "return_requested":
//         return "bg-orange-100 text-orange-700";
//       default:
//         return "bg-yellow-100 text-yellow-700";
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-100">
//       <h2 className="text-2xl font-bold mb-6">Issue Management</h2>

//       {loading ? (
//         <p>Loading requests...</p>
//       ) : issues.length === 0 ? (
//         <p className="text-gray-500">No issue records found.</p>
//       ) : (
//         <div className="bg-white rounded shadow">
//           <table className="w-full">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-3 text-left">User</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Book</th>
//                 <th className="p-3 text-left">Type</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Issue Date</th>
//                 <th className="p-3 text-left">Due Date</th>
//                 <th className="p-3 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {issues.map((issue) => (
//                 <tr key={issue._id} className="border-t">
//                   <td className="p-3">{issue.user?.name}</td>
//                   <td className="p-3">{issue.user?.email}</td>
//                   <td className="p-3">{issue.book?.title}</td>
//                   <td className="p-3 capitalize">{issue.book?.type}</td>

//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded text-sm ${getStatusStyle(
//                         issue.status
//                       )}`}
//                     >
//                       {issue.status.replace("_", " ")}
//                     </span>
//                   </td>

//                   <td className="p-3">
//                     {issue.issueDate
//                       ? new Date(issue.issueDate).toLocaleDateString()
//                       : "-"}
//                   </td>

//                   <td className="p-3">
//                     {issue.dueDate
//                       ? new Date(issue.dueDate).toLocaleDateString()
//                       : "-"}
//                   </td>

//                   <td className="p-3 space-x-2">
//                     {/* APPROVE BUTTON */}
//                     {issue.status === "requested" && (
//                       <button
//                         onClick={() => handleApprove(issue._id)}
//                         className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                       >
//                         Approve
//                       </button>
//                     )}

//                     {/* CONFIRM RETURN BUTTON */}
//                     {issue.status === "return_requested" && (
//                       <button
//                         onClick={() => handleConfirmReturn(issue._id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                       >
//                         Confirm Return
//                       </button>
//                     )}

//                     {/* NO ACTION */}
//                     {(issue.status === "approved" ||
//                       issue.status === "returned") && (
//                       <span className="text-gray-500">No Action</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
