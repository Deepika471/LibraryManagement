// src/pages/admin/ManageUsers.jsx
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Users, Search, CheckCircle2, AlertCircle, CreditCard } from "lucide-react";

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const color =
    type === "error"   ? "bg-red-600" :
    type === "warning" ? "bg-amber-500" : "bg-emerald-600";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${color}`}>
      {type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
};

export default function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch users error:", err.response?.data || err.message);
      showToast("Failed to fetch users. Check backend connection.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleIssueCard = async (userId, name) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/issue-card`);
      showToast(`Library card issued to ${name}!`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to issue card", "error");
    }
  };

  const handleClearFees = async (userId, name) => {
    if (!window.confirm(`Clear all late fees for ${name}?`)) return;
    try {
      await axiosInstance.patch(`/admin/users/${userId}/clear-fees`);
      showToast("Late fees cleared!");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to clear fees", "error");
    }
  };

  const handleToggleStatus = async (userId, isActive, name) => {
    const action = isActive ? "deactivate" : "activate";
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${name}?`)) return;
    try {
      await axiosInstance.patch(`/admin/users/${userId}/toggle-status`, { isActive: !isActive });
      showToast(`User ${action}d successfully.`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Permanently delete ${name}? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      showToast("User deleted.");
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  // ✅ FIXED: filter by `name` matching User model (not username)
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      {/* ── Quick Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users",    value: users.length,                                    color: "text-violet-600"  },
          { label: "Active",         value: users.filter(u => u.isActive !== false).length,  color: "text-emerald-600" },
          { label: "Cards Issued",   value: users.filter(u => u.hasCard).length,             color: "text-blue-600"    },
          { label: "Have Late Fees", value: users.filter(u => u.lateFees > 0).length,        color: "text-red-600"     },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Search */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4">
                {[2, 2, 1, 1, 1, 1].map((f, j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded animate-pulse" style={{ flex: f }} />
                ))}
              </div>
            ))}
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users size={36} className="mb-2 opacity-40" />
            <p className="text-sm">
              {search ? `No users match "${search}"` : "No registered users yet."}
            </p>
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Library Card</th>
                  <th className="px-6 py-3 text-left">Late Fees</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(user => {
                  const isActive = user.isActive !== false;
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">

                      {/* ✅ FIXED: user.name (matches your User model) */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800 capitalize">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </td>

                      {/* Library Card */}
                      <td className="px-6 py-4">
                        {user.hasCard ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                            <CreditCard size={14} /> Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleIssueCard(user._id, user.name)}
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            Issue Card
                          </button>
                        )}
                      </td>

                      {/* Late Fees */}
                      <td className="px-6 py-4">
                        {user.lateFees > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-semibold">₹{user.lateFees}</span>
                            <button
                              onClick={() => handleClearFees(user._id, user.name)}
                              className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-600 text-xs font-medium">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleStatus(user._id, isActive, user.name)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                              isActive
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
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


// // src/pages/admin/ManageUsers.jsx
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/admin/users");
//       if (Array.isArray(res.data)) {
//         setUsers(res.data);
//       } else {
//         setUsers([]);
//         console.error("Invalid users data format", res.data);
//       }
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     }
//   };

//   const handleClearFees = async (userId) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/admin/users/${userId}/clear-fees`);
//       fetchUsers();
//     } catch (err) {
//       console.error("Error clearing fees:", err);
//     }
//   };

//   const handleToggleStatus = async (userId, isActive) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/admin/users/${userId}/toggle-status`, {
//         isActive: !isActive,
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error("Error toggling user status:", err);
//     }
//   };

//   const handleIssueCard = async (userId) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/admin/users/${userId}/issue-card`);
//       fetchUsers();
//     } catch (err) {
//       console.error("Error issuing card:", err);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     }
//   };

//   const filteredUsers = Array.isArray(users)
//     ? users.filter((u) =>
//         u.name.toLowerCase().includes(search.toLowerCase()) ||
//         u.email.toLowerCase().includes(search.toLowerCase())
//       )
//     : [];

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* <h2 className="text-2xl font-bold text-cyan-900 mb-4">Manage Users</h2> */}

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full max-w-md"
//         />
//       </div>

//       {filteredUsers.length === 0 ? (
//         <p className="text-gray-500">No users found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border rounded shadow bg-white">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Library Card</th>
//                 <th className="p-3 text-left">Late Fees</th>
//                 <th className="p-3 text-left">Issue History</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} className="border-t">
//                   <td className="p-3">{user.name}</td>
//                   <td className="p-3">{user.email}</td>
//                   <td className="p-3">
//                     {user.hasCard ? (
//                       <span className="text-green-600 font-medium">Issued</span>
//                     ) : (
//                       <button
//                         onClick={() => handleIssueCard(user.id)}
//                         className="text-sm text-yellow-600 hover:underline"
//                       >
//                         Issue Now
//                       </button>
//                     )}
//                   </td>
//                   <td className="p-3">
//                     ₹{user.lateFees}
//                     {user.lateFees > 0 && (
//                       <button
//                         onClick={() => handleClearFees(user.id)}
//                         className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                       >
//                         Clear
//                       </button>
//                     )}
//                   </td>
//                   <td className="p-3">
//                     {user.issueHistory?.length > 0 ? (
//                       <ul className="list-disc pl-4">
//                         {user.issueHistory.map((book, idx) => (
//                           <li key={idx}>{book}</li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <span className="text-gray-400">No history</span>
//                     )}
//                   </td>
//                   <td className="p-3">
//                     <span
//                       className={
//                         user.isActive
//                           ? "text-green-600 font-medium"
//                           : "text-red-600 font-medium"
//                       }
//                     >
//                       {user.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="p-3 space-y-1">
//                     <Link
//                       to={`/admin/users/edit/${user.id}`}
//                       className="text-sm text-blue-600 hover:underline block"
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       onClick={() => handleToggleStatus(user.id, user.isActive)}
//                       className="text-sm text-orange-600 hover:underline block"
//                     >
//                       {user.isActive ? "Deactivate" : "Activate"}
//                     </button>
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="text-sm text-red-600 hover:underline block"
//                     >
//                       Delete
//                     </button>
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




