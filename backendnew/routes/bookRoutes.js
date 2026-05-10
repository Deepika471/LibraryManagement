const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Public Route
router.get("/", getBooks);

// Admin Only Routes
router.post("/", verifyToken, verifyAdmin, addBook);
router.put("/:id", verifyToken, verifyAdmin, updateBook);
router.delete("/:id", verifyToken, verifyAdmin, deleteBook);

module.exports = router;
