// src/pages/admin/AdminProfile.jsx
import { useState } from "react";
import { UserCircle, Mail, Shield, Calendar, BookOpen, Lock } from "lucide-react";

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

export default function AdminProfile() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const joinDate = stored.createdAt
    ? new Date(stored.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "N/A";

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("Passwords don't match!");
      return;
    }
    // TODO: connect to /api/auth/change-password
    alert("Connect this to your password change API endpoint.");
    setShowPasswordForm(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Profile Card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-violet-600 to-violet-400" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
              <UserCircle size={56} className="text-violet-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {stored.username || "Admin"}
          </h2>
          <span className="inline-block mt-1 px-3 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full capitalize">
            {stored.role || "admin"}
          </span>
        </div>
      </div>

      {/* ── Account Details ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-5 pb-1">
          Account Details
        </h3>
        <InfoRow icon={Mail}     label="Email"        value={stored.email}   />
        <InfoRow icon={Shield}   label="Role"         value={stored.role}    valueClass="capitalize text-violet-600 font-bold" />
        <InfoRow icon={Calendar} label="Member Since" value={joinDate}       />
        <InfoRow icon={BookOpen} label="Admin ID"     value={stored._id ? `ADM-${String(stored._id).slice(-6).toUpperCase()}` : "—"} />
      </div>

      {/* ── Password ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">Password</h3>
          <button
            onClick={() => setShowPasswordForm(v => !v)}
            className="text-xs font-semibold text-violet-600 hover:underline"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {!showPasswordForm ? (
          <p className="text-sm text-slate-400">••••••••••••</p>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: "Current Password",     key: "current"  },
              { label: "New Password",          key: "newPass"  },
              { label: "Confirm New Password",  key: "confirm"  },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


// //src/pages/admin/AdminProfile.jsx
// import React from "react";
// import { UserCircle } from "lucide-react";
// // import Header from "../../Components/AdminHeader"; 

// const AdminProfile = () => {
//   const admin = {
//     name: "Alice Admin",
//     role: "Admin",
//     email: "admin.library@example.com",
//     phone: "9876543210",
//     adminId: "ADM001",
//     joinedOn: "2022-09-10",
//     booksManaged: 148,
//   };

//   return (
//     <div className="flex flex-1 flex-col min-h-screen w-full bg-gray-100 px-48 py-4 pt-6">
//       {/* Top header */}
//       {/* <Header title="My Profile" /> */}

//       {/* Main content */}
//       <div className="">
//         <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
//           <div className="flex justify-center mb-6">
//             <UserCircle className="w-24 h-24 text-gray-400" />
//           </div>

//           <div className="text-center mb-6">
//             <h3 className="text-xl font-bold">{admin.name}</h3>
//             <p className="text-gray-600">{admin.role}</p>
//           </div>

//           <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
//             <div>
//               <span className="block text-gray-500">Email</span>
//               <span className="font-medium">{admin.email}</span>
//             </div>
//             <div>
//               <span className="block text-gray-500">Phone</span>
//               <span className="font-medium">{admin.phone}</span>
//             </div>
//             <div>
//               <span className="block text-gray-500">Admin ID</span>
//               <span className="font-medium">{admin.adminId}</span>
//             </div>
//             <div>
//               <span className="block text-gray-500">Joined On</span>
//               <span className="font-medium">{admin.joinedOn}</span>
//             </div>
//             <div>
//               <span className="block text-gray-500">Books Managed</span>
//               <span className="text-blue-600 font-semibold">{admin.booksManaged}</span>
//             </div>
//           </div>

//           <div className="flex justify-center gap-4">
//             <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition">
//               Edit Profile
//             </button>
//             <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
//               Change Password
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;
