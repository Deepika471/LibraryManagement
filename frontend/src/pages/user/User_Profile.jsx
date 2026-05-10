// src/pages/user/User_Profile.jsx
import { useState } from "react";
import { UserCircle, Mail, Shield, Calendar, BookOpen, AlertTriangle, CreditCard } from "lucide-react";

const InfoRow = ({ icon: Icon, label, value, valueClass = "text-slate-800" }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon size={17} className="text-slate-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${valueClass}`}>{value || "—"}</p>
    </div>
  </div>
);

export default function UserProfile() {
  // Pull real user from localStorage
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const joinDate = stored.createdAt
    ? new Date(stored.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "N/A";

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords don't match!");
      return;
    }
    // TODO: call /api/auth/change-password
    alert("Password change feature — connect to your API endpoint.");
    setShowPasswordForm(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Profile Card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-indigo-400" />

        {/* Avatar + name */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
              <UserCircle size={56} className="text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {stored.username || stored.name || "User"}
          </h2>
          <span className="inline-block mt-1 px-3 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full capitalize">
            {stored.role || "user"}
          </span>
        </div>
      </div>

      {/* ── Info ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-5 pb-1">
          Account Details
        </h3>
        <InfoRow icon={Mail}      label="Email"        value={stored.email} />
        <InfoRow icon={Shield}    label="Role"         value={stored.role}  valueClass="capitalize text-indigo-600 font-bold" />
        <InfoRow icon={Calendar}  label="Member Since" value={joinDate} />
        <InfoRow
          icon={CreditCard}
          label="Library Card"
          value={stored.hasCard ? "Active" : "Not Applied"}
          valueClass={stored.hasCard ? "text-emerald-600" : "text-amber-600"}
        />
        <InfoRow
          icon={AlertTriangle}
          label="Outstanding Late Fees"
          value={stored.lateFees > 0 ? `₹${stored.lateFees}` : "None"}
          valueClass={stored.lateFees > 0 ? "text-red-600" : "text-emerald-600"}
        />
      </div>

      {/* ── Password Change ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">Password</h3>
          <button
            onClick={() => setShowPasswordForm(v => !v)}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {!showPasswordForm ? (
          <p className="text-sm text-slate-400">••••••••••••</p>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: "Current Password", key: "current" },
              { label: "New Password",     key: "newPass" },
              { label: "Confirm New Password", key: "confirm" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

    </div>
  );
}


// import React from "react";
// // import UserHeader from "../../Components/UserHeader"; // Adjust path if needed
// import { FaUserCircle } from "react-icons/fa";

// const Profile = () => {
//   const user = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "9876543210",
//     membershipId: "LIB123456",
//     booksIssued: 4,
//     overdueBooks: 1,
//     joinDate: "2023-01-15",
//     role: "Student",
//   };

//   return (
//     <div className="flex flex-1 flex-col min-h-screen w-full bg-gray-50 px-44 py-4 overflow-y-auto">
//       {/* <UserHeader title="My Profile" /> */}
//       <main className="px-6 py-4">
//         <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto">
//           <div className="flex flex-col items-center">
//             <FaUserCircle className="text-6xl text-gray-400 mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
//             <p className="text-sm text-gray-500">{user.role}</p>
//           </div>

//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <p className="text-gray-600">Email</p>
//               <p className="text-gray-800 font-medium">{user.email}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Phone</p>
//               <p className="text-gray-800 font-medium">{user.phone}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Membership ID</p>
//               <p className="text-gray-800 font-medium">{user.membershipId}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Joined On</p>
//               <p className="text-gray-800 font-medium">{user.joinDate}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Books Issued</p>
//               <p className="text-blue-600 font-semibold">{user.booksIssued}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Overdue Books</p>
//               <p className="text-red-600 font-semibold">{user.overdueBooks}</p>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end gap-4">
//             <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
//               Edit Profile
//             </button>
//             <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow">
//               Change Password
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Profile;
