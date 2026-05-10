import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  requested:        { label: "Pending Approval", color: "bg-amber-100 text-amber-700 border-amber-200" },
  approved:         { label: "Issued",           color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  return_requested: { label: "Return Pending",   color: "bg-blue-100 text-blue-700 border-blue-200" },
  returned:         { label: "Returned",         color: "bg-gray-100 text-gray-600 border-gray-200" },
  rejected:         { label: "Rejected",         color: "bg-red-100 text-red-600 border-red-200" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ── Overdue badge ────────────────────────────────────────────────────────────
const OverdueBadge = () => (
  <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
    OVERDUE
  </span>
);

// ── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <svg className="w-14 h-14 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
    <p className="text-sm">{message}</p>
  </div>
);

// ── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const color = type === "error"
    ? "bg-red-600"
    : type === "warning"
    ? "bg-amber-500"
    : "bg-emerald-600";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white text-sm font-medium ${color} transition-all`}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const MyBooks = () => {
  const [allBooks, setAllBooks]     = useState([]);
  const [myIssues, setMyIssues]     = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingBooks, setLoadingBooks]   = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [toast, setToast] = useState(null); // { message, type }
  const [activeTab, setActiveTab]   = useState("issued"); // "issued" | "browse"

  useEffect(() => { fetchBooks(); fetchMyIssues(); }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch all available books ──────────────────────────────────────────────
  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const res = await axiosInstance.get("/books");
      setAllBooks(res.data);
    } catch {
      showToast("Failed to load books", "error");
    } finally {
      setLoadingBooks(false);
    }
  };

  // ── Fetch user's own issues ────────────────────────────────────────────────
  const fetchMyIssues = async () => {
    try {
      setLoadingIssues(true);
      // ✅ FIXED endpoint: /issues/my (not /issues/my-issues)
      const res = await axiosInstance.get("/issues/my");
      setMyIssues(res.data);
    } catch {
      showToast("Failed to load your issued books", "error");
    } finally {
      setLoadingIssues(false);
    }
  };

  // ── Request a book ─────────────────────────────────────────────────────────
  const handleRequest = async (bookId) => {
    try {
      await axiosInstance.post("/issues/request", { bookId });
      await fetchMyIssues();
      showToast("Book request submitted! Awaiting admin approval.");
    } catch (err) {
      showToast(err.response?.data?.message || "Request failed", "error");
    }
  };

  // ── Return a book ──────────────────────────────────────────────────────────
  const handleReturn = async (issueId, bookType) => {
    const confirmMsg = bookType === "digital"
      ? "Return this digital book?"
      : "Submit a return request? You'll need to physically return the book to the library.";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axiosInstance.put(`/issues/return/${issueId}`);
      await fetchMyIssues();
      const fee = res.data.lateFee;
      if (fee > 0) {
        showToast(`Returned! Late fee of ₹${fee} has been added to your account.`, "warning");
      } else {
        showToast(res.data.message || "Return submitted successfully!");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Return failed", "error");
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isBookAlreadyRequested = (bookId) =>
    myIssues.some(
      (issue) => issue.book?._id === bookId && issue.status !== "returned" && issue.status !== "rejected"
    );

  const isOverdue = (issue) =>
    issue.dueDate && issue.status === "approved" && new Date(issue.dueDate) < new Date();

  const filteredBooks = allBooks.filter((book) => {
    const q = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q) ||
      book.category?.toLowerCase().includes(q)
    );
  });

  // Active issues = not returned and not rejected
  const activeIssues = myIssues.filter((i) => i.status !== "returned" && i.status !== "rejected");
  const historyIssues = myIssues.filter((i) => i.status === "returned" || i.status === "rejected");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Books</h1>
        <p className="text-slate-500 mt-1">Manage your issued books and browse the library</p>
      </div>

      {/* ── Quick Stats Bar ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Issues",  value: activeIssues.length,                                                  color: "text-emerald-600" },
          { label: "Overdue",        value: myIssues.filter(isOverdue).length,                                    color: "text-red-600"     },
          { label: "Pending",        value: myIssues.filter((i) => i.status === "requested").length,              color: "text-amber-600"   },
          { label: "Total Returned", value: myIssues.filter((i) => i.status === "returned").length,               color: "text-slate-600"   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit shadow-sm">
        {[
          { id: "issued", label: "My Issued Books" },
          { id: "browse", label: "Browse Library"  },
          { id: "history", label: "History"        },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-slate-800 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB: MY ISSUED BOOKS                                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "issued" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Active Issues</h2>
            <p className="text-sm text-slate-400">Books currently issued or pending approval</p>
          </div>

          {loadingIssues ? (
            <LoadingSkeleton rows={3} cols={5} />
          ) : activeIssues.length === 0 ? (
            <EmptyState message="You have no active book issues. Browse the library to request one!" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="px-6 py-3 text-left">Book</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Due Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeIssues.map((issue) => {
                    const book     = issue.book;
                    const bookType = book?.type || "physical";
                    const overdue  = isOverdue(issue);

                    return (
                      <tr key={issue._id} className={`hover:bg-slate-50 transition-colors ${overdue ? "bg-red-50" : ""}`}>
                        {/* Book */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{book?.title || "Unknown"}</p>
                          <p className="text-xs text-slate-400">{book?.author}</p>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            bookType === "digital" ? "bg-violet-100 text-violet-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {bookType}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={issue.status} />
                        </td>

                        {/* Due Date */}
                        <td className="px-6 py-4">
                          {issue.dueDate ? (
                            <span className={overdue ? "text-red-600 font-semibold" : "text-slate-700"}>
                              {new Date(issue.dueDate).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                              {overdue && <OverdueBadge />}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <IssueActions
                            issue={issue}
                            bookType={bookType}
                            onReturn={handleReturn}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB: BROWSE LIBRARY                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, author or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-sm"
            />
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Available Books</h2>
              <span className="text-sm text-slate-400">{filteredBooks.length} books</span>
            </div>

            {loadingBooks ? (
              <LoadingSkeleton rows={5} cols={6} />
            ) : filteredBooks.length === 0 ? (
              <EmptyState message="No books match your search." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                      <th className="px-6 py-3 text-left">Title</th>
                      <th className="px-6 py-3 text-left">Author</th>
                      <th className="px-6 py-3 text-left">Category</th>
                      <th className="px-6 py-3 text-left">Type</th>
                      <th className="px-6 py-3 text-left">Copies</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.map((book) => {
                      const requested  = isBookAlreadyRequested(book._id);
                      const unavailable = book.availableCopies === 0;
                      const disabled   = requested || unavailable;

                      return (
                        <tr key={book._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-slate-800">{book.title}</p>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{book.author}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              book.type === "digital" ? "bg-violet-100 text-violet-700" : "bg-orange-100 text-orange-700"
                            }`}>
                              {book.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${book.availableCopies === 0 ? "text-red-500" : "text-emerald-600"}`}>
                              {book.availableCopies}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              disabled={disabled}
                              onClick={() => handleRequest(book._id)}
                              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                disabled
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
                              }`}
                            >
                              {requested ? "Requested" : unavailable ? "Unavailable" : "Request"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB: HISTORY                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Issue History</h2>
            <p className="text-sm text-slate-400">All returned and rejected requests</p>
          </div>

          {loadingIssues ? (
            <LoadingSkeleton rows={3} cols={5} />
          ) : historyIssues.length === 0 ? (
            <EmptyState message="No history yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="px-6 py-3 text-left">Book</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Issued On</th>
                    <th className="px-6 py-3 text-left">Returned On</th>
                    <th className="px-6 py-3 text-left">Late Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyIssues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{issue.book?.title}</p>
                        <p className="text-xs text-slate-400">{issue.book?.author}</p>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={issue.status} /></td>
                      <td className="px-6 py-4 text-slate-600">
                        {issue.issueDate
                          ? new Date(issue.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {issue.returnDate
                          ? new Date(issue.returnDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {issue.lateFee > 0 ? (
                          <span className="text-red-600 font-semibold">₹{issue.lateFee}</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Actions cell (extracted for clarity) ────────────────────────────────────
const IssueActions = ({ issue, bookType, onReturn }) => {
  if (issue.status === "requested") {
    return <span className="text-amber-600 text-xs font-medium">⏳ Awaiting approval</span>;
  }

  if (issue.status === "return_requested") {
    return <span className="text-blue-600 text-xs font-medium">📦 Return pending admin</span>;
  }

  if (issue.status === "returned") {
    return <span className="text-emerald-600 text-xs font-medium">✅ Returned</span>;
  }

  if (issue.status === "rejected") {
    return <span className="text-red-500 text-xs font-medium">❌ Rejected</span>;
  }

  // approved
  return (
    <div className="flex flex-wrap gap-2">
      {bookType === "digital" && (
        <>
          {issue.book?.pdfUrl && (
            <>
              <a
                href={issue.book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
              >
                View PDF
              </a>
              <a
                href={issue.book.pdfUrl}
                download
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </a>
            </>
          )}
          {!issue.book?.pdfUrl && issue.book?.sourceLink && (
            <a
              href={issue.book.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-700 transition-colors"
            >
              Open Source
            </a>
          )}
        </>
      )}

      {bookType === "physical" && (
        <span className="text-orange-600 text-xs font-medium mr-2">Collect from library</span>
      )}

      <button
        onClick={() => onReturn(issue._id, bookType)}
        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors active:scale-95"
      >
        {bookType === "digital" ? "Return" : "Request Return"}
      </button>
    </div>
  );
};

// ── Loading skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton = ({ rows = 4, cols = 5 }) => (
  <div className="p-6 space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <div
            key={j}
            className="h-4 bg-slate-200 rounded animate-pulse"
            style={{ flex: j === 0 ? 2 : 1 }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default MyBooks;



// import { useState, useEffect } from "react";
// import axiosInstance from "../../utils/axiosInstance";

// const MyBooks = () => {
//   const [allBooks, setAllBooks] = useState([]);
//   const [myIssues, setMyIssues] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     fetchBooks();
//     fetchMyIssues();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       const res = await axiosInstance.get("/books");
//       setAllBooks(res.data);
//     } catch (err) {
//       console.error("Failed to fetch books:", err);
//     }
//   };

//   const fetchMyIssues = async () => {
//     try {
//       const res = await axiosInstance.get("/issues/my-issues");
//       setMyIssues(res.data);
//     } catch (err) {
//       console.error("Failed to fetch issues:", err);
//     }
//   };

//   const handleRequest = async (bookId) => {
//     try {
//       await axiosInstance.post("/issues/request", { bookId });
//       fetchMyIssues();
//       alert("Book request submitted");
//     } catch (err) {
//       alert(err.response?.data?.message || "Request failed");
//     }
//   };

//   const handleReturn = async (issueId) => {
//     try {
//       const res = await axiosInstance.put(`/issues/return/${issueId}`);
//       fetchMyIssues();
//       alert(res.data.message);
//     } catch (err) {
//       alert(err.response?.data?.message || "Return failed");
//     }
//   };

//   const isBookAlreadyRequested = (bookId) => {
//     return myIssues.some(
//       (issue) =>
//         issue.book?._id === bookId &&
//         issue.status !== "returned"
//     );
//   };

//   const filteredBooks = allBooks.filter((book) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       book.title.toLowerCase().includes(query) ||
//       book.author.toLowerCase().includes(query) ||
//       book.category.toLowerCase().includes(query)
//     );
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 ml-64">
//       <h2 className="text-2xl font-bold mb-6">My Books</h2>

//       {/* ================= ISSUED BOOKS ================= */}
//       <div className="bg-white p-4 rounded shadow mb-8">
//         <h3 className="text-xl font-semibold mb-3">My Issued Books</h3>

//         {myIssues.length === 0 ? (
//           <p>No books issued yet.</p>
//         ) : (
//           <table className="w-full">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-3 text-left">Book</th>
//                 <th className="p-3 text-left">Type</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Due Date</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {myIssues.map((issue) => {
//                 const book = issue.book;
//                 const bookType = book?.type || "physical";

//                 const isOverdue =
//                   issue.dueDate &&
//                   issue.status === "approved" &&
//                   new Date(issue.dueDate) < new Date();

//                 return (
//                   <tr key={issue._id} className="border-t">
//                     <td className="p-3">{book?.title}</td>
//                     <td className="p-3 capitalize">{bookType}</td>
//                     <td className="p-3 capitalize">{issue.status}</td>

//                     <td className={`p-3 ${isOverdue ? "text-red-600 font-bold" : ""}`}>
//                       {issue.dueDate
//                         ? new Date(issue.dueDate).toLocaleDateString()
//                         : "-"}
//                     </td>

//                     <td className="p-3 space-x-2">

//                       {/* ================= APPROVED ================= */}
//                       {issue.status === "approved" && (
//                         <>
//                           {/* DIGITAL ACCESS */}
//                           {bookType === "digital" && (
//                             <>
//                               {book?.pdfUrl && (
//                                 <>
//                                   <a
//                                     href={book.pdfUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="bg-green-600 text-white px-3 py-1 rounded"
//                                   >
//                                     View PDF
//                                   </a>

//                                   <a
//                                     href={book.pdfUrl}
//                                     download
//                                     className="bg-blue-600 text-white px-3 py-1 rounded"
//                                   >
//                                     Download
//                                   </a>
//                                 </>
//                               )}

//                               {!book?.pdfUrl && book?.sourceLink && (
//                                 <a
//                                   href={book.sourceLink}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="bg-purple-600 text-white px-3 py-1 rounded"
//                                 >
//                                   Open Source
//                                 </a>
//                               )}

//                               <button
//                                 onClick={() => handleReturn(issue._id)}
//                                 className="bg-red-600 text-white px-3 py-1 rounded"
//                               >
//                                 Return
//                               </button>
//                             </>
//                           )}

//                           {/* PHYSICAL BOOK */}
//                           {bookType === "physical" && (
//                             <>
//                               <span className="text-orange-600 font-semibold">
//                                 Collect from center
//                               </span>

//                               <button
//                                 onClick={() => handleReturn(issue._id)}
//                                 className="bg-orange-600 text-white px-3 py-1 rounded"
//                               >
//                                 Request Return
//                               </button>
//                             </>
//                           )}
//                         </>
//                       )}

//                       {/* ================= RETURN REQUESTED ================= */}
//                       {issue.status === "return_requested" && (
//                         <span className="text-blue-600 font-semibold">
//                           Return Requested (Waiting for Admin Approval)
//                         </span>
//                       )}

//                       {/* ================= RETURNED ================= */}
//                       {issue.status === "returned" && (
//                         <span className="text-green-600 font-semibold">
//                           Returned
//                         </span>
//                       )}

//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ================= SEARCH ================= */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by title, author or category..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full p-3 border rounded shadow-sm"
//         />
//       </div>

//       {/* ================= AVAILABLE BOOKS ================= */}
//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-xl font-semibold mb-3">Available Books</h3>

//         <table className="w-full">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-3 text-left">Title</th>
//               <th className="p-3 text-left">Author</th>
//               <th className="p-3 text-left">Category</th>
//               <th className="p-3 text-left">Type</th>
//               <th className="p-3 text-left">Available</th>
//               <th className="p-3 text-left">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredBooks.map((book) => (
//               <tr key={book._id} className="border-t">
//                 <td className="p-3">{book.title}</td>
//                 <td className="p-3">{book.author}</td>
//                 <td className="p-3">{book.category}</td>
//                 <td className="p-3 capitalize">{book.type}</td>
//                 <td className="p-3">{book.availableCopies}</td>
//                 <td className="p-3">
//                   <button
//                     disabled={
//                       book.availableCopies === 0 ||
//                       isBookAlreadyRequested(book._id)
//                     }
//                     onClick={() => handleRequest(book._id)}
//                     className={`px-3 py-1 rounded text-white ${
//                       book.availableCopies === 0 ||
//                       isBookAlreadyRequested(book._id)
//                         ? "bg-gray-400"
//                         : "bg-blue-600 hover:bg-blue-700"
//                     }`}
//                   >
//                     {isBookAlreadyRequested(book._id)
//                       ? "Already Requested"
//                       : "Request"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MyBooks;
