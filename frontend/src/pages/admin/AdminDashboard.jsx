// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  BookOpen, Users, CreditCard, AlertTriangle,
  ClipboardList, RefreshCw, ChevronRight, TrendingUp,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, bg, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">
        {value ?? <span className="text-slate-300 animate-pulse">—</span>}
      </p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [issues,  setIssues]  = useState([]);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, issuesRes] = await Promise.all([
        axiosInstance.get("/issues/stats"),
        axiosInstance.get("/issues/all?status=requested"),
      ]);
      setStats(statsRes.data);
      setIssues(issuesRes.data.slice(0, 5)); // last 5 pending
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Welcome ───────────────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, <span className="text-violet-600 capitalize">{admin.username || "Admin"}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening in your library today.</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={BookOpen}     label="Total Books"      value={stats?.totalBooks}
          color="text-violet-600"  bg="bg-violet-50"
          onClick={() => navigate("/admin/books")}
        />
        <StatCard
          icon={Users}        label="Total Users"      value={stats?.totalUsers}
          color="text-blue-600"    bg="bg-blue-50"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          icon={ClipboardList} label="Currently Issued" value={stats?.totalIssued}
          color="text-emerald-600" bg="bg-emerald-50"
          onClick={() => navigate("/admin/issued")}
        />
        <StatCard
          icon={AlertTriangle} label="Pending Requests" value={stats?.pendingRequests}
          color="text-amber-600"   bg="bg-amber-50"
          onClick={() => navigate("/admin/issued")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Secondary Stats ────────────────────────────────────────────── */}
        <div className="space-y-4">
          <StatCard
            icon={RefreshCw}   label="Return Pending"    value={stats?.returnRequests}
            color="text-orange-600" bg="bg-orange-50"
            onClick={() => navigate("/admin/issued")}
          />
          <StatCard
            icon={CreditCard}  label="Cards Issued"      value={stats?.usersWithCard}
            color="text-indigo-600" bg="bg-indigo-50"
            onClick={() => navigate("/admin/users")}
          />
          <StatCard
            icon={TrendingUp}  label="Users with Late Fees" value={stats?.usersWithLateFees}
            color="text-red-600"    bg="bg-red-50"
            onClick={() => navigate("/admin/users")}
          />
        </div>

        {/* ── Pending Requests ───────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Pending Book Requests</h2>
              <p className="text-xs text-slate-400">Awaiting your approval</p>
            </div>
            <button
              onClick={() => navigate("/admin/issued")}
              className="flex items-center gap-1 text-xs text-violet-600 font-medium hover:underline"
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
          ) : issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <ClipboardList size={36} className="mb-2 opacity-40" />
              <p className="text-sm">No pending requests right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {issues.map(issue => (
                <div key={issue._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{issue.book?.title || "—"}</p>
                    <p className="text-xs text-slate-400">
                      Requested by <span className="font-medium">{issue.user?.username || issue.user?.email}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/issued")}
                    className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


// //src/pages/admin/AdminDashboard.jsx
// import { useUsers } from "../../context/UserContext";

// export default function AdminDashboard() {
//   const { users } = useUsers();

//   // Dummy number of books managed by admin
//   const totalBooks = 50;

//   const totalUsers = users.length;
//   const usersWithCard = users.filter(user => user.hasCard).length;
//   const usersWithoutCard = users.filter(user => !user.hasCard).length;
//   const usersWithLateFees = users.filter(user => user.lateFees > 0).length;

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <div className="text-2xl font-bold mb-6 text-cyan-900">Welcome, Admin!</div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-cyan-800">
//           <h3 className="text-lg font-semibold text-gray-700">Books Managed</h3>
//           <p className="text-2xl font-bold text-cyan-800">{totalBooks}</p>
//         </div>

//         <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-cyan-800">
//           <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
//           <p className="text-2xl font-bold text-cyan-800">{totalUsers}</p>
//         </div>

//         <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-green-600">
//           <h3 className="text-lg font-semibold text-gray-700">Library Cards Issued</h3>
//           <p className="text-2xl font-bold text-green-600">{usersWithCard}</p>
//         </div>

//         <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-yellow-500">
//           <h3 className="text-lg font-semibold text-gray-700">Pending Library Cards</h3>
//           <p className="text-2xl font-bold text-yellow-500">{usersWithoutCard}</p>
//         </div>

//         <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-red-600">
//           <h3 className="text-lg font-semibold text-gray-700">Users with Late Fees</h3>
//           <p className="text-2xl font-bold text-red-600">{usersWithLateFees}</p>
//         </div>
//       </div>
//     </div>
//   );
// }



