// src/pages/admin/IssueCard.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { CreditCard, User, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function IssueCard() {
  const { userId } = useParams();
  const navigate   = useNavigate();

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Reuse the admin users list and find the user
        const res = await axiosInstance.get("/admin/users");
        const found = res.data.find(u => u._id === userId);
        setUser(found || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleIssue = async () => {
    setIssuing(true);
    try {
      await axiosInstance.patch(`/admin/users/${userId}/issue-card`);
      setDone(true);
      setTimeout(() => navigate("/admin/users"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to issue card");
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-slate-500 mb-4">User not found.</p>
        <button onClick={() => navigate("/admin/users")} className="text-violet-600 text-sm hover:underline">
          ← Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">

      {/* ── User Info Card ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-5">Issue Library Card</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
              <User size={22} className="text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 capitalize">{user.username}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Library Card</p>
              <p className={`text-sm font-semibold ${user.hasCard ? "text-emerald-600" : "text-amber-600"}`}>
                {user.hasCard ? "Already Issued" : "Not Issued"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Late Fees</p>
              <p className={`text-sm font-semibold ${user.lateFees > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {user.lateFees > 0 ? `₹${user.lateFees}` : "None"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action ────────────────────────────────────────────────────────── */}
      {done ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
          <p className="font-semibold text-emerald-700">Library card issued successfully!</p>
          <p className="text-sm text-emerald-600 mt-1">Redirecting to users list...</p>
        </div>
      ) : user.hasCard ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
          <CreditCard size={36} className="text-slate-400 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">This user already has a library card.</p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 flex items-center gap-2 text-sm text-violet-600 hover:underline mx-auto"
          >
            <ArrowLeft size={14} /> Back to Users
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-600 mb-5">
            Issuing a library card will grant this user full borrowing privileges.
            They will be able to borrow up to 3 books simultaneously.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleIssue}
              disabled={issuing}
              className="flex-1 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
            >
              {issuing ? "Issuing..." : "Issue Library Card"}
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="px-5 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// //src/pages/admin/IssueCard.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useUsers } from "../../context/UserContext";
// // import Header from "../../Components/AdminHeader";

// export default function IssueCard() {
//   const { userId } = useParams();
//   const navigate = useNavigate(); 
//   const { users, issueCard } = useUsers();

//   const user = users.find((u) => u.id === parseInt(userId));
//   if (!user) return <div className="p-6">User not found.</div>;

//   const handleIssue = () => {
//     issueCard(user.id);
//     alert(`Library card issued to ${user.name}`);
//     navigate("/admin/users");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* <Header title="Issue Library Card" /> */}

//       <div className="p-6 max-w-2xl mx-auto">
//         <div className="bg-white p-6 rounded shadow">
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Status:</strong> {user.hasCard ? "Card Issued" : "Pending"}</p>

//           {!user.hasCard ? (
//             <button
//               onClick={handleIssue}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Issue Card
//             </button>
//           ) : (
//             <p className="mt-4 text-green-600 font-semibold">Library card has been issued!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
