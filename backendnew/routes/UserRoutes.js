// routes/userRoutes.js
const express = require("express");
const router  = express.Router();
const {
  getAllUsers,
  issueCard,
  clearLateFees,
  toggleStatus,
  deleteUser,
} = require("../controllers/userController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// All routes require login + admin role
router.use(verifyToken, verifyAdmin);

// GET  /api/admin/users              → get all users
router.get("/users", getAllUsers);

// PATCH /api/admin/users/:id/issue-card   → issue library card
router.patch("/users/:id/issue-card", issueCard);

// PATCH /api/admin/users/:id/clear-fees   → clear late fees
router.patch("/users/:id/clear-fees", clearLateFees);

// PATCH /api/admin/users/:id/toggle-status → activate/deactivate
router.patch("/users/:id/toggle-status", toggleStatus);

// DELETE /api/admin/users/:id        → delete user
router.delete("/users/:id", deleteUser);

module.exports = router;
