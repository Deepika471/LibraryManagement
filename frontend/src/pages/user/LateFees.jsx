// src/pages/user/LateFees.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IndianRupee, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
      <Icon size={20} className={color} />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  </div>
);

export default function LateFees() {
  const [issues,  setIssues]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch all user's issues, filter ones with late fees client-side
        const res = await axiosInstance.get("/issues/my");
        setIssues(res.data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Only show issues that are returned and have a late fee, or overdue
  const feeIssues = issues.filter(
    i => (i.lateFee > 0) || (i.status === "approved" && i.dueDate && new Date(i.dueDate) < new Date())
  );

  const totalFee     = feeIssues.reduce((sum, i) => sum + (i.lateFee || 0), 0);
  const overdueCount = issues.filter(
    i => i.status === "approved" && i.dueDate && new Date(i.dueDate) < new Date()
  ).length;

  // Live overdue fee estimate for currently overdue books (not yet confirmed returned)
  const estimateLiveFee = (issue) => {
    if (issue.lateFee > 0) return issue.lateFee; // already calculated
    if (issue.status !== "approved" || !issue.dueDate) return 0;
    const days = Math.ceil((new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * 5 : 0;
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Late Fees</h1>
        <p className="text-slate-500 text-sm mt-1">Track overdue fines and payment status</p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={IndianRupee}   label="Total Fees Due"  value={`₹${totalFee}`}   color="text-red-600"    bg="bg-red-50"    />
        <StatCard icon={AlertTriangle} label="Overdue Books"   value={overdueCount}      color="text-amber-600"  bg="bg-amber-50"  />
        <StatCard icon={CheckCircle2}  label="Returned On Time"
          value={issues.filter(i => i.status === "returned" && !i.lateFee).length}
          color="text-emerald-600" bg="bg-emerald-50"
        />
      </div>

      {/* ── Policy Note ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
        <p>
          A fine of <strong>₹5 is charged per day</strong> for overdue books.
          Return books on or before the due date to avoid fines.
        </p>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Fee Records</h2>
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
        ) : feeIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-slate-400">
            <CheckCircle2 size={36} className="mb-2 opacity-40" />
            <p className="text-sm">No late fees. Great job returning books on time!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3 text-left">Book</th>
                  <th className="px-6 py-3 text-left">Due Date</th>
                  <th className="px-6 py-3 text-left">Returned On</th>
                  <th className="px-6 py-3 text-left">Overdue Days</th>
                  <th className="px-6 py-3 text-left">Fine</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeIssues.map(issue => {
                  const fee        = estimateLiveFee(issue);
                  const isLive     = issue.status === "approved"; // still overdue, not returned
                  const overdueDays = issue.dueDate
                    ? Math.max(0, Math.ceil((new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24)))
                    : 0;

                  return (
                    <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{issue.book?.title || "—"}</p>
                        <p className="text-xs text-slate-400">{issue.book?.author}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {issue.dueDate
                          ? new Date(issue.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {issue.returnDate
                          ? new Date(issue.returnDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : <span className="text-amber-600 font-medium">Not returned yet</span>}
                      </td>
                      <td className="px-6 py-4 text-amber-600 font-semibold">
                        {overdueDays} {isLive && <span className="text-xs text-slate-400 font-normal">(growing)</span>}
                      </td>
                      <td className="px-6 py-4 text-red-600 font-bold">₹{fee}</td>
                      <td className="px-6 py-4">
                        {isLive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            Fee Applied
                          </span>
                        )}
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


// //LateFees.jsx
// // import UserHeader from "../../Components/UserHeader";

// const fineData = [
//   {
//     id: 1,
//     title: "The Catcher in the Rye",
//     dueDate: "2025-05-25",
//     returnedDate: "2025-05-28",
//     overdueDays: 3,
//     fine: 30,
//     status: "Unpaid",
//   },
//   {
//     id: 2,
//     title: "To Kill a Mockingbird",
//     dueDate: "2025-05-20",
//     returnedDate: "2025-05-20",
//     overdueDays: 0,
//     fine: 0,
//     status: "Paid",
//   },
// ];

// const totalFine = fineData.reduce(
//   (sum, item) => sum + (item.status === "Unpaid" ? item.fine : 0),
//   0
// );
// const overdueCount = fineData.filter((item) => item.overdueDays > 0).length;

// const LateFees = () => {
//   const handlePayment = () => {
//     alert("Redirecting to payment gateway to pay ₹" + totalFine);
//     // Add real payment integration here
//   };

//   return (
//     <div className="flex flex-1 flex-col min-h-screen w-full px-1 py-4 ml-64 bg-gray-50">
//       {/* <UserHeader title="Late Fees" /> */}

//       <main className="px-6 py-4">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow p-6">
//             <p className="text-gray-600">Total Fine</p>
//             <h2 className="text-xl font-semibold text-red-600">₹{totalFine}</h2>
//           </div>
//           <div className="bg-white rounded-xl shadow p-6">
//             <p className="text-gray-600">Overdue Books</p>
//             <h2 className="text-xl font-semibold text-yellow-600">{overdueCount}</h2>
//           </div>
//           <div className="bg-white rounded-xl shadow p-6">
//             <p className="text-gray-600">Waived Fines</p>
//             <h2 className="text-xl font-semibold text-green-600">₹0</h2>
//           </div>
//         </div>

//         {/* Pay Now Button */}
//         {totalFine > 0 && (
//           <div className="mb-6">
//             <button
//               onClick={handlePayment}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
//             >
//               Pay Now
//             </button>
//           </div>
//         )}

//         {/* Table */}
//         <div className="bg-white shadow rounded-xl overflow-x-auto">
//           <table className="min-w-full text-left">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-4">Book Title</th>
//                 <th className="p-4">Due Date</th>
//                 <th className="p-4">Returned Date</th>
//                 <th className="p-4">Overdue (days)</th>
//                 <th className="p-4">Fine (₹)</th>
//                 <th className="p-4">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fineData.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="p-4 text-center text-gray-500">
//                     No fines recorded.
//                   </td>
//                 </tr>
//               ) : (
//                 fineData.map((fine) => (
//                   <tr key={fine.id} className="border-b hover:bg-gray-50">
//                     <td className="p-4 font-medium text-gray-800">{fine.title}</td>
//                     <td className="p-4">{fine.dueDate}</td>
//                     <td className="p-4">{fine.returnedDate}</td>
//                     <td className="p-4 text-yellow-600 font-semibold">{fine.overdueDays}</td>
//                     <td className="p-4 text-red-600 font-semibold">₹{fine.fine}</td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2 py-1 rounded-full text-sm font-medium ${
//                           fine.status === "Paid"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {fine.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Policy Note */}
//         <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md">
//           <strong>Note:</strong> A fine of ₹5 is charged per day for overdue books. Make sure to return books on or before the due date to avoid fines.
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LateFees;


