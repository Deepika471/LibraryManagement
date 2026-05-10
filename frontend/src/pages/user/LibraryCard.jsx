// src/pages/user/LibraryCard.jsx
import { useState } from "react";
import { CreditCard, CheckCircle2, User, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

// ── Input Field ──────────────────────────────────────────────────────────────
const FormField = ({ icon: Icon, label, name, type = "text", value, onChange, error, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={15} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
        }`}
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function LibraryCard() {
  const stored  = JSON.parse(localStorage.getItem("user") || "{}");
  const hasCard = stored?.hasCard;

  const [form, setForm]       = useState({
    name:    stored.username || "",
    email:   stored.email    || "",
    phone:   "",
    address: "",
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim())   e.phone   = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone))     e.phone = "Must be 10 digits";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      // TODO: connect to your API when you build the library card endpoint
      // await axiosInstance.post("/user/library-card/apply", form);
      await new Promise(r => setTimeout(r, 800)); // simulate
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Already has a card ────────────────────────────────────────────────────
  if (hasCard) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Library Card</h1>
          <p className="text-slate-500 text-sm mt-1">Your membership details</p>
        </div>

        {/* Card visual */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full bg-white/5" />

          <div className="flex items-center justify-between mb-8 relative">
            <div>
              <p className="text-xs text-indigo-200 uppercase tracking-widest font-medium">LibraryMS</p>
              <p className="text-lg font-bold mt-0.5">Member Card</p>
            </div>
            <CreditCard size={32} className="text-white/70" />
          </div>

          <div className="relative">
            <p className="text-2xl font-bold capitalize tracking-wide">
              {stored.username || stored.name || "Member"}
            </p>
            <p className="text-indigo-200 text-sm mt-1">{stored.email}</p>
          </div>

          <div className="flex items-center justify-between mt-6 relative">
            <div>
              <p className="text-xs text-indigo-300">MEMBER ID</p>
              <p className="text-sm font-mono font-bold mt-0.5">
                LIB-{String(stored._id || "000000").slice(-6).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-300">STATUS</p>
              <p className="text-sm font-semibold mt-0.5 text-emerald-300">● Active</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Card Privileges</h3>
          <ul className="space-y-3">
            {[
              "Borrow up to 3 books at a time",
              "14-day borrowing period per book",
              "Access to digital book library",
              "Priority reservation for new arrivals",
            ].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // ── Submitted success ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 text-sm">
            Your library card application is under review. The admin will approve it shortly
            and your card will be activated.
          </p>
        </div>
      </div>
    );
  }

  // ── Application form ──────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Library Card</h1>
        <p className="text-slate-500 text-sm mt-1">Apply for your library membership card</p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
        <AlertCircle size={17} className="mt-0.5 flex-shrink-0" />
        <p>Fill out the form below. Your card will be activated after admin approval.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField
            icon={User} label="Full Name" name="name"
            value={form.name} onChange={handleChange}
            error={errors.name} placeholder="John Doe"
          />
          <FormField
            icon={Mail} label="Email Address" name="email" type="email"
            value={form.email} onChange={handleChange}
            error={errors.email} placeholder="john@example.com"
          />
          <FormField
            icon={Phone} label="Phone Number" name="phone" type="tel"
            value={form.phone} onChange={handleChange}
            error={errors.phone} placeholder="9876543210" maxLength={10}
          />

          {/* Address (textarea) */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                <MapPin size={15} />
              </div>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="123 Library St, City"
                className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-colors ${
                  errors.address ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Apply for Library Card"}
          </button>
        </form>
      </div>
    </div>
  );
}


// //LibraryCard.jsx
// import React, { useState } from "react";
// // import UserHeader from "../../Components/UserHeader"; // ✅ Adjust the path if needed

// const LibraryCard = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     if (!form.name.trim()) newErrors.name = "Name is required";
//     if (!form.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email))
//       newErrors.email = "Email is invalid";
//     if (!form.phone.trim()) newErrors.phone = "Phone number is required";
//     else if (!/^\d{10}$/.test(form.phone))
//       newErrors.phone = "Phone must be 10 digits";
//     if (!form.address.trim()) newErrors.address = "Address is required";
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length === 0) {
//       setSubmitted(true);
//       // You can integrate API call here if needed
//     } else {
//       setErrors(validationErrors);
//       setSubmitted(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-tr from-blue-200 via-indigo-200 to-purple-300 flex flex-col items-center px-72 pt-6">
//       {/* <Header title="Library Card" /> */}

//       <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 mt-6">
//         <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
//           Library Card Application
//         </h1>

//         {submitted ? (
//           <div className="text-center text-green-700 font-semibold text-lg">
//             🎉 Your library card application has been submitted successfully!
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} noValidate>
//             <div className="mb-4">
//               <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
//                 Full Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
//                   errors.name ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="John Doe"
//               />
//               {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
//                 Email Address <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="john@example.com"
//               />
//               {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 id="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
//                   errors.phone ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="1234567890"
//                 maxLength={10}
//               />
//               {errors.phone && <p className="text-red-500 mt-1 text-sm">{errors.phone}</p>}
//             </div>

//             <div className="mb-6">
//               <label htmlFor="address" className="block mb-1 font-medium text-gray-700">
//                 Address <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="address"
//                 id="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
//                   errors.address ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="123 Library St, City, Country"
//                 rows={3}
//               />
//               {errors.address && <p className="text-red-500 mt-1 text-sm">{errors.address}</p>}
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
//             >
//               Apply for Library Card
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LibraryCard;
