// src/pages/user/UserSettings.jsx
import { useState } from "react";
import { Bell, Moon, Lock, User, CheckCircle2 } from "lucide-react";

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-slate-100 mb-5">
    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon size={17} className="text-indigo-600" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
  </div>
);

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? "bg-indigo-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

export default function UserSettings() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    username: stored.username || "",
    email:    stored.email    || "",
  });

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    dueDateReminders:   true,
    darkMode:           false,
  });

  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });

  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    // TODO: call /api/auth/update-profile
    showSaved();
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords don't match!");
      return;
    }
    if (passwords.newPass.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    // TODO: call /api/auth/change-password
    alert("Password update — connect this to your API.");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl shadow-xl">
          <CheckCircle2 size={16} />
          Settings saved!
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* ── Profile Section ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader icon={User} title="Profile Information" description="Update your display name and email" />

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* ── Password Section ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader icon={Lock} title="Change Password" description="Use a strong password you don't use elsewhere" />

        <form onSubmit={handlePasswordSave} className="space-y-4">
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
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* ── Notifications Section ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="Control what emails and alerts you receive"
        />
        <div className="divide-y divide-slate-100">
          <Toggle
            checked={prefs.emailNotifications}
            onChange={v => setPrefs(p => ({ ...p, emailNotifications: v }))}
            label="Email Notifications"
            description="Get updates about your account activity"
          />
          <Toggle
            checked={prefs.dueDateReminders}
            onChange={v => setPrefs(p => ({ ...p, dueDateReminders: v }))}
            label="Due Date Reminders"
            description="Remind me 2 days before a book is due"
          />
        </div>
      </div>

      {/* ── Preferences Section ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader
          icon={Moon}
          title="Preferences"
          description="Personalise your experience"
        />
        <Toggle
          checked={prefs.darkMode}
          onChange={v => setPrefs(p => ({ ...p, darkMode: v }))}
          label="Dark Mode"
          description="Switch to a darker interface (coming soon)"
        />
      </div>

    </div>
  );
}


// //UserSettings.jsx
// import React, { useState } from "react";
// // import UserHeader from "../../Components/UserHeader"; // Update path based on your file structure

// const Settings = () => {
//   const [formData, setFormData] = useState({
//     name: "John Doe",
//     email: "john@example.com",
//     password: "",
//     notifications: true,
//     darkMode: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Settings saved successfully!");
//     console.log(formData);
//   };

//   return (
//     <div className="flex flex-1 flex-col min-h-screen w-full bg-gray-50 px-52 py-4 overflow-y-auto">
//       {/* <UserHeader title="Settings" /> */}

//       <main className="px-6 py-4">
//         <form
//           onSubmit={handleSubmit}
//           className="max-w-3xl space-y-6 bg-white shadow-md rounded-xl p-6"
//         >
//           {/* Profile Info */}
//           <div className="">
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">Profile</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Password Change */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">Change Password</h3>
//             <input
//               type="password"
//               name="password"
//               placeholder="New Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           {/* Notifications */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">Notifications</h3>
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 name="notifications"
//                 checked={formData.notifications}
//                 onChange={handleChange}
//                 className="form-checkbox text-blue-600"
//               />
//               <span className="ml-2 text-gray-700">Receive email notifications for due dates</span>
//             </label>
//           </div>

//           {/* Preferences */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">Preferences</h3>
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 name="darkMode"
//                 checked={formData.darkMode}
//                 onChange={handleChange}
//                 className="form-checkbox text-blue-600"
//               />
//               <span className="ml-2 text-gray-700">Enable Dark Mode</span>
//             </label>
//           </div>

//           {/* Save Button */}
//           <div className="pt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </main>
//     </div>
//   );
// };

// export default Settings;
