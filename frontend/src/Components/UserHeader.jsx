// src/components/UserHeader.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, UserCircle } from "lucide-react";

export default function UserHeader({ title }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isDashboard = location.pathname === "/user/dashboard";

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Left: back + title */}
      <div className="flex items-center gap-3">
        {!isDashboard && (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      {/* Right: profile */}
      <button
        onClick={() => navigate("/user/profile")}
        className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        title="View Profile"
      >
        <UserCircle size={28} className="text-slate-600" />
      </button>
    </div>
  );
}


// // src/components/UserHeader.jsx
// import { useNavigate, useLocation } from "react-router-dom";
// import { ArrowLeft, UserCircle } from "lucide-react";

// const UserHeader = ({ title }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleBack = () => {
//     if (location.pathname === "/user/dashboard") return;
//     navigate(-1);
//   };

//   const goToProfile = () => {
//     navigate("/user/profile");
//   };

//   return (
//     <div className="mb-6 flex items-center justify-between">
//       {/* Back Button + Title */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={handleBack}
//           className="p-2 rounded-full hover:bg-gray-200 transition"
//           title="Go Back"
//         >
//           <ArrowLeft className="w-5 h-5 text-gray-600" />
//         </button>
//         <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
//       </div>

//       {/* Profile Button */}
//       <button
//         onClick={goToProfile}
//         className="gap-2 px-3 py-3 rounded-full bg-gray-100"
//         title="View Profile"
//       >
//         <UserCircle className="w-8 h-8" />
//         <span className="text-gray-700 font-medium"></span>
//       </button>
//     </div>
//   );
// };

// export default UserHeader;



