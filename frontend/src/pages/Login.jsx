// src/pages/Login.jsx
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Library, AlertCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from '../Components/Navbar'


export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", {
        email:    formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/lib3.jpg"
          alt="Library"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-indigo-900/70" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Brand mark */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3" group>
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Library size={20} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">LibraryMS</span>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome back</h2>
          <p className="text-white/50 text-sm text-center mb-7">Sign in to your library account</p>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/40 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-white/50">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


// //src/pages/Login.jsx
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import axiosInstance from "../utils/axiosInstance";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axiosInstance.post("/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       const { token, user } = res.data;

//       // Save auth data
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       alert("Login successful!");

//       // Redirect based on role
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="relative w-screen min-h-screen flex items-center justify-center py-16">
//       <div className="absolute inset-0">
//         <img
//           src="/src/assets/lib3.jpg"
//           className="w-full h-full object-cover"
//           alt="Library background"
//         />
//         <div className="absolute inset-0 bg-black opacity-70" />
//       </div>

//       <div className="relative z-10 bg-white/70 p-8 rounded-2xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-cyan-900">
//           Login
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-900"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <div className="relative mt-1">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-900"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800"
//               >
//                 {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-cyan-950 text-white py-2 rounded-lg hover:bg-gray-400 transition"
//           >
//             Login
//           </button>
//         </form>

//         <p className="mt-6 text-sm text-center text-gray-800">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-blue-800 hover:underline">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
