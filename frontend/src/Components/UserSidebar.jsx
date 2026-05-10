// src/components/UserSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, AlertCircle,
  CreditCard, Settings, LogOut, Library,
} from "lucide-react";

const navItems = [
  { to: "/user/dashboard",   icon: LayoutDashboard, label: "Dashboard"    },
  { to: "/user/mybooks",     icon: BookOpen,        label: "My Books"     },
  { to: "/user/latefees",    icon: AlertCircle,     label: "Late Fees"    },
  { to: "/user/librarycard", icon: CreditCard,      label: "Library Card" },
];

export default function UserSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Library size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">LibraryMS</p>
            <p className="text-xs text-slate-400">User Panel</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-1">
        <NavLink
          to="/user/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}


// //src/components/UserSidebar.jsx
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   BookOpen,
//   CreditCard,
//   LibrarySquare,
//   Settings,
//   LogOut,
// } from "lucide-react";

// const Sidebar = () => {
//   return (
//     <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col justify-between p-4">
//       <div>
//         <h1 className="text-2xl font-bold mb-6 text-center">User Panel</h1>
//         <nav className="space-y-4">
//           <NavLink to="/user/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
//             <LayoutDashboard size={20} />
//             Dashboard
//           </NavLink>
//           <NavLink to="/user/my-books" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
//             <BookOpen size={20} />
//             My Books
//           </NavLink>
//           {/* <NavLink to="/user/history" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
//             <History size={20} />
//             History
//           </NavLink> */}
//           <NavLink to="/user/late-fees" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
//             <CreditCard size={20} />
//             Late Fees
//           </NavLink>
//           <NavLink to="/user/library-card" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
//             <LibrarySquare size={20} />
//             Library Card
//           </NavLink>
//         </nav>
//       </div>

//       <div className="space-y-4">
//         <NavLink to="/user/settings" className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
//           <Settings size={20} />
//           Settings
//         </NavLink>
//         <NavLink to="/user/logout" className="flex items-center gap-3 p-2 rounded text-red-400 hover:bg-red-600 hover:text-white">
//           <LogOut size={20} />
//           Logout
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

