// src/pages/admin/AdminSettings.jsx
import { useState } from "react";
import { BookOpen, Users, Palette, CheckCircle2, IndianRupee, Clock } from "lucide-react";

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 pb-4 border-b border-slate-100 mb-5">
    <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon size={17} className="text-violet-600" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
  </div>
);

const NumberField = ({ label, description, value, onChange, min = 0, prefix }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-sm text-slate-500 font-medium">{prefix}</span>}
      <input
        type="number" min={min} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-24 border border-slate-200 rounded-xl text-sm text-right py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-violet-400 ${prefix ? "pl-7" : "pl-3"}`}
      />
    </div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      type="button" onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-violet-600" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    lateFeePerDay:    5,
    maxBooksPerUser:  3,
    issueDuration:    14,
    cardFee:          200,
    autoApproveUsers: false,
  });
  const [saved, setSaved] = useState(false);

  const update = (key, value) => setSettings(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    // TODO: POST to /api/admin/settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
        <p className="text-slate-500 text-sm mt-1">Configure library policies and system preferences</p>
      </div>

      {/* ── Library Policies ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader
          icon={BookOpen}
          title="Library Policies"
          description="Control borrowing rules and fine structure"
        />
        <NumberField
          label="Late Fee Per Day"
          description="Charged per day after the due date"
          value={settings.lateFeePerDay}
          onChange={v => update("lateFeePerDay", v)}
          prefix="₹" min={1}
        />
        <NumberField
          label="Max Books Per User"
          description="Maximum simultaneous issues per member"
          value={settings.maxBooksPerUser}
          onChange={v => update("maxBooksPerUser", v)}
          min={1}
        />
        <NumberField
          label="Issue Duration (days)"
          description="Default borrowing period before due date"
          value={settings.issueDuration}
          onChange={v => update("issueDuration", v)}
          min={1}
        />
      </div>

      {/* ── User Management ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionHeader
          icon={Users}
          title="User Management"
          description="Control membership and card settings"
        />
        <Toggle
          label="Auto-Approve New Users"
          description="Automatically activate accounts on registration"
          checked={settings.autoApproveUsers}
          onChange={v => update("autoApproveUsers", v)}
        />
        <NumberField
          label="Library Card Fee"
          description="One-time fee charged for card issuance"
          value={settings.cardFee}
          onChange={v => update("cardFee", v)}
          prefix="₹" min={0}
        />
      </div>

      {/* ── Save ──────────────────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}


// //src/pages/admin/AdminSettings.jsx
// import { useState } from "react";
// // import Header from "../../Components/AdminHeader";

// export default function Settings() {
//   const [lateFee, setLateFee] = useState(5);
//   const [maxBooks, setMaxBooks] = useState(3);
//   const [issueDuration, setIssueDuration] = useState(14);
//   const [autoApproveUsers, setAutoApproveUsers] = useState(true);
//   const [theme, setTheme] = useState("light");
//   const [cardFee, setCardFee] = useState(200);

//   const handleSave = () => {
//     alert("Settings saved successfully!");
//     // Here you can add logic to persist settings via API or local storage
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       {/* <Header title="Settings" /> */}
//       {/* <h2 className="text-2xl font-bold mb-6">Settings</h2> */}

//       <div className="space-y-6">
//         {/* Library Policies */}
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-4">Library Policies</h3>

//           <div className="mb-4">
//             <label className="block font-medium">Late Fee Per Day (₹)</label>
//             <input
//               type="number"
//               value={lateFee}
//               onChange={(e) => setLateFee(Number(e.target.value))}
//               className="mt-1 w-full border p-2 rounded"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium">Max Books Per User</label>
//             <input
//               type="number"
//               value={maxBooks}
//               onChange={(e) => setMaxBooks(Number(e.target.value))}
//               className="mt-1 w-full border p-2 rounded"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium">Issue Duration (days)</label>
//             <input
//               type="number"
//               value={issueDuration}
//               onChange={(e) => setIssueDuration(Number(e.target.value))}
//               className="mt-1 w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         {/* User Management */}
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-4">User Management</h3>

//           <div className="flex items-center gap-4">
//             <span className="font-medium">Auto-Approve New Users</span>
//             <input
//               type="checkbox"
//               checked={autoApproveUsers}
//               onChange={() => setAutoApproveUsers(!autoApproveUsers)}
//               className="w-5 h-5"
//             />
//           </div>

//           <div className="mt-4">
//             <label className="block font-medium">Library Card Fee (₹)</label>
//             <input
//               type="number"
//               value={cardFee}
//               onChange={(e) => setCardFee(Number(e.target.value))}
//               className="mt-1 w-full border p-2 rounded"
//             />
//           </div>
//         </div>

//         {/* Appearance */}
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-semibold mb-4">Appearance</h3>

//           <label className="block font-medium mb-2">Theme</label>
//           <select
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//             className="w-full border p-2 rounded"
//           >
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
//           </select>
//         </div>

//         {/* Save Button */}
//         <div className="text-right">
//           <button
//             onClick={handleSave}
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           >
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
