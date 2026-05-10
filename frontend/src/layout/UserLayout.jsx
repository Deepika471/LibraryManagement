// src/layouts/UserLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserHeader  from "../components/UserHeader";
import { useEffect, useState } from "react";

const pageTitles = {
  "/user/dashboard":   "Dashboard",
  "/user/mybooks":     "My Books",
  "/user/latefees":    "Late Fees",
  "/user/librarycard": "Library Card",
  "/user/settings":    "Settings",
  "/user/profile":     "My Profile",
};

export default function UserLayout() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const matched = Object.keys(pageTitles).find((key) =>
      location.pathname.startsWith(key)
    );
    const title = pageTitles[matched] || "User Panel";
    setPageTitle(title);
    document.title = `${title} | LibraryMS`;
  }, [location.pathname]);

  return (
    // Root: flex row, full viewport height, NO overflow-x
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">

      {/* Fixed sidebar — 256px wide */}
      <UserSidebar />

      {/* Content area: pushed right by sidebar width, fills remaining space */}
      {/* min-w-0 is CRITICAL — prevents flex child expanding beyond parent */}
      <div className="flex flex-col flex-1 ml-64 min-w-0">
        <UserHeader title={pageTitle} />

        {/* Page content — Outlet renders here, no extra padding from pages needed */}
        <main className="flex-1 p-6 min-w-0">
          <Outlet />
        </main>
      </div>

    </div>
  );
}


// // src/layouts/UserLayout.jsx
// import { Outlet, useLocation } from "react-router-dom";
// import UserSidebar from "../components/UserSidebar";
// import UserHeader from "../components/UserHeader";
// import { useEffect, useState } from "react";

// const pageTitles = {
//   "/user/dashboard":    "User Dashboard",
//   "/user/mybooks":      "My Books",
//   "/user/latefees":     "Late Fees",
//   "/user/librarycard":  "Library Card",
//   "/user/settings":     "Settings",
//   "/user/profile":      "User Profile",
// };

// export default function UserLayout() {
//   const location = useLocation();
//   const [pageTitle, setPageTitle] = useState("User Panel");

//   useEffect(() => {
//     const matched = Object.keys(pageTitles).find((key) =>
//       location.pathname.startsWith(key)
//     );
//     const title = pageTitles[matched] || "User Panel";
//     setPageTitle(title);
//     document.title = `${title} | Library Management`;
//   }, [location.pathname]);

//   return (
//   <div className="flex min-h-screen bg-gray-100">
//     <UserSidebar />   {/* sidebar is fixed position internally */}
//     <div className="flex-1 flex flex-col ml-64 min-w-0">
//       <UserHeader title={pageTitle} />
//       <main className="flex-1 p-6">
//         <Outlet />
//       </main>
//     </div>
//   </div>
// );
// }



// import { Outlet, useLocation } from "react-router-dom";
// import UserSidebar from "../components/UserSidebar";
// import UserHeader from "../components/UserHeader";
// import { useEffect, useState } from "react";

// // Define route → title mapping
// const pageTitles = {
//   "/user/dashboard": "User Dashboard",
//   "/user/mybooks": "My Books",
//   "/user/latefees": "Late Fees",
//   "/user/librarycard": "Library Card",
//   "/user/settings": "Settings",
//   "/user/profile": "User Profile",
// };

// export default function UserLayout() {
//   const location = useLocation();
//   const [pageTitle, setPageTitle] = useState("");

//   useEffect(() => {
//     const path = location.pathname;
//     const matchedKey = Object.keys(pageTitles).find((key) => path.startsWith(key));
//     setPageTitle(pageTitles[matchedKey] || "User Panel");
//     document.title = `${pageTitles[matchedKey] || "User"} | Library Management`;
//   }, [location.pathname]);

//   return (
//     <div className="w-screen h-full flex">
//       <UserSidebar />
//       <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-6 ml-64">
//         <UserHeader title={pageTitle} />
//         <Outlet />
//       </div>
//     </div>
//   );
// }



// import { Outlet } from "react-router-dom";
// import UserSidebar from "../Components/UserSidebar";
// import UserHeader from "../Components/UserHeader";

// export default function AdminLayout() {
//   return (
//     <div className="w-screen h-full flex">
//       <UserSidebar />
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <UserHeader />
//         <Outlet />
//       </div>
//     </div>
//   );
// }
