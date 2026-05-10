// src/pages/admin/ManageBooks.jsx
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Plus, Pencil, Trash2, BookOpen, X, CheckCircle2, AlertCircle } from "lucide-react";

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const color = type === "error" ? "bg-red-600" : "bg-emerald-600";
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${color}`}>
      {type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
};

// ── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
    <BookOpen size={40} className="mb-3 opacity-40" />
    <p className="text-sm">No books yet. Add your first book!</p>
  </div>
);

const EMPTY_FORM = { title: "", category: "", author: "", type: "physical", totalCopies: "", pdfUrl: "", sourceLink: "" };

export default function ManageBooks() {
  const [books,     setBooks]     = useState([]);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState("");

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/books");
      setBooks(res.data);
    } catch {
      showToast("Failed to load books", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, totalCopies: Number(form.totalCopies) };
      if (isEditing) {
        await axiosInstance.put(`/books/${editId}`, payload);
        showToast("Book updated successfully!");
      } else {
        await axiosInstance.post("/books", payload);
        showToast("Book added successfully!");
      }
      fetchBooks();
      resetForm();
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleEdit = (book) => {
    setForm({
      title:       book.title,
      category:    book.category,
      author:      book.author,
      type:        book.type || "physical",
      totalCopies: book.totalCopies,
      pdfUrl:      book.pdfUrl      || "",
      sourceLink:  book.sourceLink  || "",
    });
    setEditId(book._id);
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/books/${id}`);
      showToast("Book deleted.");
      fetchBooks();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    return b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Books</h1>
          <p className="text-slate-500 text-sm mt-1">{books.length} books in the library</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(v => !v); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Book"}
        </button>
      </div>

      {/* ── Add / Edit Form ──────────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-5">
            {isEditing ? "Edit Book" : "Add New Book"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "title",    placeholder: "Book Title",  required: true  },
                { name: "author",   placeholder: "Author Name", required: true  },
                { name: "category", placeholder: "Category",    required: true  },
              ].map(({ name, placeholder, required }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">{name}</label>
                  <input
                    name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} required={required}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Total Copies</label>
                <input
                  name="totalCopies" type="number" min="1"
                  value={form.totalCopies} onChange={handleChange} required
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Book Type</label>
                <select
                  name="type" value={form.type} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                >
                  <option value="physical">Physical</option>
                  <option value="digital">Digital</option>
                </select>
              </div>
            </div>

            {/* Digital fields — only shown when type is digital */}
            {form.type === "digital" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">PDF URL (Google Drive)</label>
                  <input
                    name="pdfUrl" value={form.pdfUrl} onChange={handleChange}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">External Source Link</label>
                  <input
                    name="sourceLink" value={form.sourceLink} onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                {isEditing ? "Update Book" : "Add Book"}
              </button>
              <button
                type="button" onClick={resetForm}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Search + Table ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="px-6 py-4 border-b border-slate-100">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, author or category..."
            className="w-full max-w-sm px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex gap-4">
                {[2,1,1,1,1,1,1].map((f,j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded animate-pulse" style={{ flex: f }} />
                ))}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Author</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Available</th>
                  <th className="px-6 py-3 text-left">Digital</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(book => (
                  <tr key={book._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{book.title}</td>
                    <td className="px-6 py-4 text-slate-600">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{book.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${book.type === "digital" ? "bg-violet-100 text-violet-700" : "bg-orange-100 text-orange-700"}`}>
                        {book.type || "physical"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{book.totalCopies}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${book.availableCopies === 0 ? "text-red-500" : "text-emerald-600"}`}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {book.pdfUrl ? (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">PDF</span>
                      ) : book.sourceLink ? (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">Link</span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// //src/pages/admin/ManageBooks.jsx
// import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";

// export default function ManageBooks() {
//   const [books, setBooks] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     category: "",
//     author: "",
//     totalCopies: "",
//     pdfUrl: "",
//     sourceLink: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch all books
//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("/books");
//       setBooks(res.data);
//     } catch (err) {
//       console.error("Failed to fetch books:", err.response?.data || err.message);
//       alert("Error fetching books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const resetForm = () => {
//     setForm({
//       title: "",
//       category: "",
//       author: "",
//       totalCopies: "",
//       pdfUrl: "",
//       sourceLink: "",
//     });
//     setIsEditing(false);
//     setEditId(null);
//   };

//   // Add Book
//   const handleAddBook = async (e) => {
//     e.preventDefault();

//     try {
//       await axiosInstance.post("/books", {
//         ...form,
//         totalCopies: Number(form.totalCopies),
//       });

//       fetchBooks();
//       resetForm();
//     } catch (err) {
//       console.error("Add book error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to add book");
//     }
//   };

//   // Edit Book
//   const handleEditBook = (book) => {
//     setForm({
//       title: book.title,
//       category: book.category,
//       author: book.author,
//       totalCopies: book.totalCopies,
//       pdfUrl: book.pdfUrl || "",
//       sourceLink: book.sourceLink || "",
//     });
//     setEditId(book._id);
//     setIsEditing(true);
//   };

//   // Update Book
//   const handleUpdateBook = async (e) => {
//     e.preventDefault();

//     try {
//       await axiosInstance.put(`/books/${editId}`, {
//         ...form,
//         totalCopies: Number(form.totalCopies),
//       });

//       fetchBooks();
//       resetForm();
//     } catch (err) {
//       console.error("Update failed:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to update book");
//     }
//   };

//   // Delete Book
//   const handleDeleteBook = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this book?")) return;

//     try {
//       await axiosInstance.delete(`/books/${id}`);
//       fetchBooks();
//     } catch (err) {
//       console.error("Delete failed:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to delete book");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h2 className="text-2xl font-bold mb-4">Manage Books</h2>

//       {/* Form */}
//       <form
//         onSubmit={isEditing ? handleUpdateBook : handleAddBook}
//         className="mb-6 bg-white p-4 rounded shadow"
//       >
//         <div className="grid grid-cols-2 gap-4">

//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Title"
//             required
//             className="p-2 border rounded"
//           />

//           <input
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             placeholder="Category"
//             required
//             className="p-2 border rounded"
//           />

//           <input
//             name="author"
//             value={form.author}
//             onChange={handleChange}
//             placeholder="Author"
//             required
//             className="p-2 border rounded"
//           />

//           <input
//             name="totalCopies"
//             type="number"
//             value={form.totalCopies}
//             onChange={handleChange}
//             placeholder="Total Copies"
//             required
//             className="p-2 border rounded"
//           />

//           {/* 🔥 PDF URL */}
//           <input
//             name="pdfUrl"
//             value={form.pdfUrl}
//             onChange={handleChange}
//             placeholder="Google Drive PDF Link (Optional)"
//             className="p-2 border rounded col-span-2"
//           />

//           {/* 🔥 Source Link */}
//           <input
//             name="sourceLink"
//             value={form.sourceLink}
//             onChange={handleChange}
//             placeholder="External Source Link (Optional)"
//             className="p-2 border rounded col-span-2"
//           />

//         </div>

//         <button
//           type="submit"
//           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {isEditing ? "Update Book" : "Add Book"}
//         </button>
//       </form>

//       {/* Table */}
//       {loading ? (
//         <p>Loading books...</p>
//       ) : (
//         <table className="w-full bg-white rounded shadow">
//           <thead className="bg-gray-200 text-left">
//             <tr>
//               <th className="p-3">Title</th>
//               <th className="p-3">Category</th>
//               <th className="p-3">Author</th>
//               <th className="p-3">Total</th>
//               <th className="p-3">Available</th>
//               <th className="p-3">Digital</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {books.map((book) => (
//               <tr key={book._id} className="border-t">
//                 <td className="p-3">{book.title}</td>
//                 <td className="p-3">{book.category}</td>
//                 <td className="p-3">{book.author}</td>
//                 <td className="p-3">{book.totalCopies}</td>
//                 <td className="p-3">{book.availableCopies}</td>
//                 <td className="p-3">
//                   {book.pdfUrl ? (
//                     <span className="text-green-600 font-semibold">PDF</span>
//                   ) : book.sourceLink ? (
//                     <span className="text-blue-600 font-semibold">Link</span>
//                   ) : (
//                     <span className="text-gray-500">None</span>
//                   )}
//                 </td>
//                 <td className="p-3 space-x-2">
//                   <button
//                     onClick={() => handleEditBook(book)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteBook(book._id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {books.length === 0 && (
//               <tr>
//                 <td className="p-3 text-center" colSpan="7">
//                   No books available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
