// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  BookOpen, AlertTriangle, Clock, IndianRupee,
  ChevronRight, CheckCircle2, BookMarked,
} from "lucide-react";

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    approved:         "bg-emerald-100 text-emerald-700",
    requested:        "bg-amber-100 text-amber-700",
    return_requested: "bg-blue-100 text-blue-700",
    returned:         "bg-slate-100 text-slate-500",
    rejected:         "bg-red-100 text-red-600",
  };
  const labels = {
    approved: "Issued", requested: "Pending",
    return_requested: "Return Pending", returned: "Returned", rejected: "Rejected",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-500"}`}>
      {labels[status] || status}
    </span>
  );
};

export default function UserDashboard() {
  const [issues,  setIssues]  = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get logged-in user name from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.username || user?.name || "there";

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // ✅ Fixed endpoint
        const res = await axiosInstance.get("/issues/my");
        setIssues(res.data);
      } catch (err) {
        console.error("Error fetching issues:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────────
  const totalIssued     = issues.filter(i => i.status === "approved").length;
  const pendingRequests = issues.filter(i => i.status === "requested").length;
  const overdueCount    = issues.filter(i =>
    i.status === "approved" && new Date(i.dueDate) < new Date()
  ).length;
  const totalLateFees   = issues.reduce((sum, i) => sum + (i.lateFee || 0), 0);

  // ── Recent issues (last 5, excluding returned/rejected) ───────────────────
  const recentActive = issues
    .filter(i => i.status !== "returned" && i.status !== "rejected")
    .slice(0, 5);

  // ── Due soon (within 3 days) ──────────────────────────────────────────────
  const dueSoon = issues.filter(i => {
    if (i.status !== "approved" || !i.dueDate) return false;
    const diff = (new Date(i.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  });

  return (
    <div>
      {/* ── Welcome ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, <span className="text-indigo-600 capitalize">{username}</span> 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's your library activity at a glance.</p>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen}      label="Currently Issued" value={loading ? "—" : totalIssued}     color="text-indigo-600"  bg="bg-indigo-50" />
        <StatCard icon={Clock}         label="Pending Requests" value={loading ? "—" : pendingRequests} color="text-amber-600"   bg="bg-amber-50"  />
        <StatCard icon={AlertTriangle} label="Overdue"          value={loading ? "—" : overdueCount}    color="text-red-600"    bg="bg-red-50"    />
        <StatCard icon={IndianRupee}   label="Total Late Fees"  value={loading ? "—" : `₹${totalLateFees}`} color="text-rose-600" bg="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Active Issues ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Active Issues</h2>
              <p className="text-xs text-slate-400">Your current borrowed books</p>
            </div>
            <button
              onClick={() => navigate("/user/mybooks")}
              className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 bg-slate-200 rounded animate-pulse flex-[2]" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse flex-1" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
          ) : recentActive.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <BookMarked size={36} className="mb-2 opacity-40" />
              <p className="text-sm">No active issues. Browse books to get started!</p>
              <button
                onClick={() => navigate("/user/mybooks")}
                className="mt-3 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Library
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActive.map(issue => {
                const isOverdue = issue.status === "approved" && issue.dueDate && new Date(issue.dueDate) < new Date();
                return (
                  <div key={issue._id} className={`px-6 py-3.5 flex items-center justify-between ${isOverdue ? "bg-red-50" : ""}`}>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{issue.book?.title || "—"}</p>
                      <p className="text-xs text-slate-400">{issue.book?.author}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        {issue.dueDate && (
                          <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-slate-500"}`}>
                            {isOverdue ? "⚠ Overdue · " : "Due · "}
                            {new Date(issue.dueDate).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short",
                            })}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right Panel ────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Due Soon Alert */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Due Soon</h2>
              <p className="text-xs text-slate-400">Books due within 3 days</p>
            </div>

            {dueSoon.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-4 text-sm text-emerald-600">
                <CheckCircle2 size={18} />
                <span>No books due soon. All clear!</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {dueSoon.map(issue => (
                  <div key={issue._id} className="px-5 py-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700 truncate max-w-[140px]">
                      {issue.book?.title}
                    </p>
                    <span className="text-xs text-amber-600 font-semibold whitespace-nowrap">
                      {new Date(issue.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-800 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Browse & Request Books", path: "/user/mybooks",     color: "bg-indigo-600 hover:bg-indigo-700" },
                { label: "Check Late Fees",         path: "/user/latefees",   color: "bg-rose-500 hover:bg-rose-600"     },
                { label: "My Library Card",         path: "/user/librarycard",color: "bg-emerald-600 hover:bg-emerald-700" },
              ].map(({ label, path, color }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// //UserDashboard.jsx
// import { useState, useEffect } from "react";
// import StatsCard from "../../Components/StatsCard";
// import DueAlertCard from "../../Components/DueAlertCard";
// import axiosInstance from "../../utils/axiosInstance";

// const UserDashboard = () => {
//   const [issues, setIssues] = useState([]);

//   useEffect(() => {
//     const fetchIssues = async () => {
//       try {
//         const res = await axiosInstance.get("/issues/my-issues");
//         setIssues(res.data);
//       } catch (err) {
//         console.error("Error fetching issues:", err.response?.data || err.message);
//       }
//     };

//     fetchIssues();
//   }, []);

//   // Basic stats calculation
//   const totalIssued = issues.length;
//   const currentlyIssued = issues.filter(i => i.status === "approved").length;
//   const overdue = issues.filter(i => {
//     if (i.status !== "approved") return false;
//     return new Date(i.dueDate) < new Date();
//   }).length;

//   return (
//     <div className="flex h-screen w-screen">
//       <div className="flex-1 bg-gray-100 px-6 py-4 overflow-y-auto">
//         <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
//           <h2 className="text-xl font-bold mb-4">Welcome, User!</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <StatsCard title="Books Issued" value={totalIssued} />
//             <StatsCard title="Currently Issued" value={currentlyIssued} />
//             <StatsCard title="Overdue" value={overdue} />
//             <StatsCard title="Total Fine" value="₹0" />
//           </div>

//           <div className="mt-6 space-y-4">
//             <DueAlertCard />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
