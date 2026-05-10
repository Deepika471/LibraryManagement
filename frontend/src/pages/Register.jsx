// src/pages/Register.jsx
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Library, AlertCircle, CheckCircle2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username:        "",   // ✅ matches your User model field
    email:           "",
    password:        "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Register
      await axiosInstance.post("/auth/register", {
        name: formData.username,   // ✅ send username, not name
        email:    formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Auto-login after registration
      const loginRes = await axiosInstance.post("/auth/login", {
        email:    formData.email,
        password: formData.password,
      });

      const { token, user } = loginRes.data;
      console.log(user);
      console.log(user.role);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6)  return { label: "Too short",  color: "bg-red-500",    width: "w-1/4" };
    if (pwd.length < 8)  return { label: "Weak",        color: "bg-orange-500", width: "w-2/4" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
                          return { label: "Fair",        color: "bg-amber-400",  width: "w-3/4" };
    return               { label: "Strong",      color: "bg-emerald-500", width: "w-full" };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-10">
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
        {/* Brand */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Library size={20} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">LibraryMS</span>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-1">Create account</h2>
          <p className="text-white/50 text-sm text-center mb-7">Join the library community today</p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="johndoe"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
              Register As
              </label>
              <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="user" className="text-black">User</option>
                <option value="admin" className="text-black">Admin</option>
              </select>
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

              {/* Password strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-white/50 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>

                {/* Match indicator */}
                {formData.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/40 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-white/50">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



// //src/pages/Register.jsx
// import { useNavigate, Link } from "react-router-dom";
// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import axiosInstance from "../utils/axiosInstance";

// export default function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await axiosInstance.post("/auth/register", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       alert("Registration successful!");

//       // Automatically login after registration
//       const loginRes = await axiosInstance.post("/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       const { token, user } = loginRes.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Redirect based on role
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/user/dashboard");
//       }

//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="relative w-screen min-h-screen flex items-center justify-center py-16">
//       <div className="absolute inset-0">
//         <img
//           src="/src/assets/lib3.jpg"
//           className="w-full h-full object-cover"
//           alt="Library"
//         />
//         <div className="absolute inset-0 bg-black opacity-70" />
//       </div>

//       <div className="relative z-10 bg-white/70 p-8 rounded-2xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-cyan-900">
//           Create Account
//         </h2>

//         <form className="space-y-5" onSubmit={handleSubmit}>
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-900"
//             />
//           </div>

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

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Confirm Password
//             </label>
//             <div className="relative mt-1">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-900"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-800"
//               >
//                 {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-cyan-950 text-white py-2 rounded-lg hover:bg-gray-400 transition"
//           >
//             Register
//           </button>
//         </form>

//         <p className="mt-6 text-sm text-center text-gray-800">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-800 hover:underline">
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
