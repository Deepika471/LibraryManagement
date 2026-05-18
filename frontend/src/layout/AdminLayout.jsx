// src/layout/AdminLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";
import AdminHeader  from "../Components/AdminHeader";
import { useEffect, useState } from "react";

const pageTitles = {
  "/admin/dashboard":  "Dashboard",
  "/admin/books":      "Manage Books",
  "/admin/users":      "Manage Users",
  "/admin/issued":     "Issue Management",
  "/admin/settings":   "Settings",
  "/admin/profile":    "Admin Profile",
};

export default function AdminLayout() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const matched = Object.keys(pageTitles).find((key) =>
      location.pathname.startsWith(key)
    );
    const title = pageTitles[matched] || "Admin Panel";
    setPageTitle(title);
    document.title = `${title} | LibraryMS`;
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 ml-64 min-w-0">
        <AdminHeader title={pageTitle} />
        <main className="flex-1 p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


// //src/layout/AdminLayout.jsx
// import { Outlet, useLocation } from "react-router-dom";
// import AdminSidebar from "../components/AdminSidebar";
// import AdminHeader from "../components/AdminHeader";
// import { useEffect, useState } from "react";

// // Define route → title mapping
// const pageTitles = {
//   "/admin/dashboard": "Admin Dashboard",
//   "/admin/books": "Manage Books",
//   "/admin/users": "Manage Users",
//   "/admin/users/issue": "Issue Library Card",
//   "/admin/issued": "Issued Books",
//   "/admin/settings": "Admin Settings",
//   "/admin/profile": "Admin Profile",
// };

// export default function AdminLayout() {
//   const location = useLocation();
//   const [pageTitle, setPageTitle] = useState("");

//   useEffect(() => {
//     const path = location.pathname;
//     const matchedKey = Object.keys(pageTitles).find(key => path.startsWith(key));
//     setPageTitle(pageTitles[matchedKey] || "Admin Panel");
//     document.title = `${pageTitles[matchedKey] || "Admin"} | Library Management`;
//   }, [location.pathname]);

//   return (
//     <div className="w-screen h-full flex">
//       <AdminSidebar />
//       <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-6 ml-64">
//         {/* ✅ Send title to header */}
//         <AdminHeader title={pageTitle} />
//         <Outlet />
//       </div>
//     </div>
//   );
// }

