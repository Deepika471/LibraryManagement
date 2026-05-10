const express = require("express");
const router = express.Router();
const {
  requestBook,
  approveRequest,
  rejectRequest,
  returnBook,
  confirmReturn,
  getAllRequests,
  getMyIssues,
  getDashboardStats,
} = require("../controllers/issueController");

// ✅ Matches your actual authMiddleware.js export names
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────
// USER ROUTES (logged-in users)
// ─────────────────────────────────────────

// POST /api/issues/request          → User requests a book
router.post("/request", verifyToken, requestBook);

// GET  /api/issues/my               → User sees their own issues
//   Optional query: ?status=approved|requested|returned
router.get("/my", verifyToken, getMyIssues);

// PUT  /api/issues/return/:id       → User initiates return
router.put("/return/:id", verifyToken, returnBook);

// ─────────────────────────────────────────
// ADMIN ROUTES (admin only)
// ─────────────────────────────────────────

// GET  /api/issues/all              → Admin sees all requests
//   Optional query: ?status=requested|approved|return_requested|returned
router.get("/all", verifyToken, verifyAdmin, getAllRequests);

// GET  /api/issues/stats            → Admin dashboard stats
router.get("/stats", verifyToken, verifyAdmin, getDashboardStats);

// PUT  /api/issues/approve/:id      → Admin approves a request
router.put("/approve/:id", verifyToken, verifyAdmin, approveRequest);

// PUT  /api/issues/reject/:id       → Admin rejects a request
router.put("/reject/:id", verifyToken, verifyAdmin, rejectRequest);

// PUT  /api/issues/confirm-return/:id → Admin confirms physical return
router.put("/confirm-return/:id", verifyToken, verifyAdmin, confirmReturn);

module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   requestBook,
//   approveRequest,
//   returnBook,
//   confirmReturn,
//   getAllRequests,
//   getMyIssues,
// } = require("../controllers/issueController");

// const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// // // ================= USER ROUTES =================
// router.post("/request", verifyToken, requestBook);
// router.get("/my-issues", verifyToken, getMyIssues);
// router.put("/return/:id", verifyToken, returnBook);

// // // ================= ADMIN ROUTES =================
// router.get("/all", verifyToken, verifyAdmin, getAllRequests);
// router.put("/approve/:id", verifyToken, verifyAdmin, approveRequest);
// router.put("/confirm-return/:id", verifyToken, verifyAdmin, confirmReturn);

// module.exports = router;
