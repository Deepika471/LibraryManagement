// src/Components/Navbar.jsx
import { Link } from "react-router-dom";
import { Library } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between">

      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow">
          <Library size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">LibraryMS</span>
      </Link>

      {/* Nav Buttons */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-white/80 hover:text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all shadow"
        >
          Register
        </Link>
      </div>

    </nav>
  );
}


// // src/Components/Navbar.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { Library } from "lucide-react";

// export default function Navbar() {
//   const navigate  = useNavigate();
//   const user      = JSON.parse(localStorage.getItem("user") || "null");
//   const isLoggedIn = !!user;

//   const handleDashboard = () => {
//     if (user?.role === "admin") navigate("/admin/dashboard");
//     else navigate("/user/dashboard");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
//       {/* Brand */}
//       <Link to="/" className="flex items-center gap-2.5">
//         <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow">
//           <Library size={16} className="text-white" />
//         </div>
//         <span className="text-white font-bold text-lg tracking-tight">LibraryMS</span>
//       </Link>

//       {/* Nav Links */}
//       <div className="flex items-center gap-3">
//         {isLoggedIn ? (
//           <>
//             <button
//               onClick={handleDashboard}
//               className="text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-1.5"
//             >
//               Sign in
//             </button>
//             <button
//               onClick={handleLogout}
//               className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
//             >
//               Register
//             </button>
//           </>
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-1.5"
//             >
//               Sign In
//             </Link>
//             <Link
//               to="/register"
//               className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all shadow"
//             >
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


// // import { useState } from 'react'
// // import { Link } from 'react-router-dom'

// // export default function Navbar() {
// //   const [showLoginDropdown, setShowLoginDropdown] = useState(false)

// //   const toggleDropdown = () => setShowLoginDropdown(prev => !prev)

// //   return (
// //     <nav className="w-full bg-orange-100 py-2 px-6 shadow-lg flex items-center justify-between">
// //       <h1 className="text-2xl font-bold"></h1>
// //       <div className="space-x-4 relative">
// //         {/* Login dropdown */}
// //         <div className="inline-block relative">
// //           {/* <button
// //             onClick={toggleDropdown}
// //             className="flex justify-end bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
// //           >
// //             Login
// //           </button> */}
// //           <Link
// //             to="/login"
// //             className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
// //             >
// //             Login
// //           </Link>
// //           {/* {showLoginDropdown && (
// //             <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
// //               <Link
// //                 to="/login/admin"
// //                 className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
// //                 onClick={() => setShowLoginDropdown(false)}
// //               >
// //                 Admin
// //               </Link>
// //               <Link
// //                 to="/login/user"
// //                 className="block px-4 py-2 text-blue-600 hover:bg-gray-100"
// //                 onClick={() => setShowLoginDropdown(false)}
// //               >
// //                 User
// //               </Link>
// //             </div>
// //           )} */}
// //         </div>

// //         {/* Register button */}
// //         <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition">
// //           Register
// //         </Link>
// //       </div>
// //     </nav>
// //   )
// // }



