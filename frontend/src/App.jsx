import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home     from "./pages/Home.jsx";
import Login    from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Shared Components
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

// Admin Layout + Pages
import AdminLayout    from "./layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageBooks    from "./pages/admin/ManageBooks.jsx";
import ManageUsers    from "./pages/admin/ManageUsers.jsx";
import IssueCard      from "./pages/admin/IssueCard.jsx";
import IssueBooks     from "./pages/admin/IssueBooks.jsx";
import AdminSettings  from "./pages/admin/AdminSettings.jsx";
import AdminProfile   from "./pages/admin/AdminProfile.jsx";

// User Layout + Pages
import UserLayout     from "./layout/UserLayout.jsx";
import UserDashboard  from "./pages/user/UserDashboard.jsx";
import MyBooks        from "./pages/user/MyBooks.jsx";
import LateFees       from "./pages/user/LateFees.jsx";
import LibraryCard    from "./pages/user/LibraryCard.jsx";
import UserProfile    from "./pages/user/User_Profile.jsx";
import UserSettings   from "./pages/user/UserSettings.jsx";

function App() {
  return (
    <Routes>

      {/* ── Public Routes ──────────────────────────────────────────────── */}
      <Route path="/"         element={<Home />}     />
      <Route path="/login"    element={<Login />}    />
      <Route path="/register" element={<Register />} />

      {/* ── Admin Routes ───────────────────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard"          element={<AdminDashboard />} />
        <Route path="/admin/books"              element={<ManageBooks />}    />
        <Route path="/admin/users"              element={<ManageUsers />}    />
        <Route path="/admin/users/issue/:userId" element={<IssueCard />}    />
        <Route path="/admin/issued"             element={<IssueBooks />}     />
        <Route path="/admin/settings"           element={<AdminSettings />}  />
        <Route path="/admin/profile"            element={<AdminProfile />}   />
      </Route>

      {/* ── User Routes ────────────────────────────────────────────────── */}
      {/* ✅ All paths match UserSidebar NavLinks and dashboard buttons exactly */}
      <Route
        element={
          <ProtectedRoute role="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user/dashboard"   element={<UserDashboard />} />
        <Route path="/user/mybooks"     element={<MyBooks />}       />  {/* ✅ was /user/my-books */}
        <Route path="/user/latefees"    element={<LateFees />}      />  {/* ✅ was /user/late-fees */}
        <Route path="/user/librarycard" element={<LibraryCard />}   />  {/* ✅ was /user/library-card */}
        <Route path="/user/profile"     element={<UserProfile />}   />
        <Route path="/user/settings"    element={<UserSettings />}  />
      </Route>

      {/* ── Catch-all ──────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// // import Loginadmin from "./pages/Loginadmin.jsx";
// import Register from "./pages/Register.jsx";
// import ProtectedRoute from "./Components/ProtectedRoute.jsx";


// // Admin Layout and Pages
// import AdminLayout from "./layout/AdminLayout.jsx";
// import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import ManageBooks from "./pages/admin/ManageBooks.jsx";
// import ManageUsers from "./pages/admin/ManageUsers.jsx";
// import IssueCard from "./pages/admin/IssueCard.jsx";
// import IssueBooks from "./pages/admin/IssueBooks.jsx";
// import AdminSettings from "./pages/admin/AdminSettings.jsx";
// import AdminProfile from "./pages/admin/AdminProfile.jsx";

// // User Layout and Pages
// import UserLayout from "./layout/UserLayout.jsx";
// import UserDashboard from "./pages/user/UserDashboard.jsx";
// import MyBooks from "./pages/user/MyBooks.jsx";
// import LateFees from "./pages/user/LateFees.jsx";
// import LibraryCard from "./pages/user/LibraryCard.jsx";
// import Profile from "./pages/user/User_Profile.jsx";
// import UserSettings from "./pages/user/UserSettings.jsx";

// function App() {
//   return (
    
//       <Routes>

//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         {/* <Route path="/login/admin" element={<Loginadmin />} /> */}
//         <Route path="/register" element={<Register />} />

//         {/* Admin Routes */}
//         <Route element={<ProtectedRoute role="admin"> <AdminLayout /> </ProtectedRoute>} >
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/books" element={<ManageBooks />} />
//           <Route path="/admin/users" element={<ManageUsers />} />
//           <Route path="/admin/users/issue/:userId" element={<IssueCard />} />
//           <Route path="/admin/issued" element={<IssueBooks />} />
//           <Route path="/admin/settings" element={<AdminSettings />} />
//           <Route path="/admin/profile" element={<AdminProfile />} />
//         </Route>

//         {/* User Routes */}
//         <Route element={<ProtectedRoute role="user"> <UserLayout /></ProtectedRoute>}>
//           <Route path="/user/dashboard" element={<UserDashboard />} />
//           <Route path="/user/my-books" element={<MyBooks />} />
//           <Route path="/user/late-fees" element={<LateFees />} />
//           <Route path="/user/library-card" element={<LibraryCard />} />
//           <Route path="/user/profile" element={<Profile />} />
//           <Route path="/user/settings" element={<UserSettings />} />
//         </Route>

//         {/* Default Redirects */}
//         <Route path="*" element={<Navigate to="/" replace />} />
      
//         <Route path="/admin/dashboard" element={
//           <ProtectedRoute role="admin"> 
//           <AdminLayout> <AdminDashboard /> </AdminLayout> 
//           </ProtectedRoute>}
//         />

//       </Routes>


//   );
// }

// export default App;



