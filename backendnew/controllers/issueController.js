const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");

const LATE_FEE_PER_DAY = 5; // ₹5 per day

// ================= USER: REQUEST BOOK =================
exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Validate book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available right now" });
    }

    // ✅ FIX: Prevent duplicate pending requests
    const existingRequest = await Issue.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ["requested", "approved"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message:
          existingRequest.status === "approved"
            ? "You already have this book issued"
            : "You already have a pending request for this book",
      });
    }

    const issue = await Issue.create({
      user: req.user._id,
      book: bookId,
      status: "requested",
    });

    res.status(201).json({ message: "Book request submitted successfully", issue });
  } catch (error) {
    console.error("requestBook error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= ADMIN: APPROVE REQUEST =================
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id).populate("book");
    if (!issue) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (issue.status !== "requested") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const book = issue.book;
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    // Decrease availability
    book.availableCopies -= 1;
    await book.save();

    // Set 14-day due date
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 14);

    issue.status = "approved";
    issue.issueDate = issueDate;
    issue.dueDate = dueDate;
    await issue.save();

    res.json({ message: "Request approved. Book issued for 14 days.", issue });
  } catch (error) {
    console.error("approveRequest error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= ADMIN: REJECT REQUEST =================
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (issue.status !== "requested") {
      return res.status(400).json({ message: "Only pending requests can be rejected" });
    }

    issue.status = "rejected";
    await issue.save();

    res.json({ message: "Request rejected", issue });
  } catch (error) {
    console.error("rejectRequest error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= USER: RETURN BOOK =================
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id).populate("book");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status !== "approved") {
      return res.status(400).json({ message: "Only approved issues can be returned" });
    }

    // DIGITAL BOOK → return immediately
    if (issue.book.type === "digital") {
      issue.status = "returned";
      issue.returnDate = new Date();

      // Calculate late fee even for digital books
      const fee = calculateLateFee(issue.dueDate, issue.returnDate);
      issue.lateFee = fee;
      await issue.save();

      // Update user's total lateFees in User model
      if (fee > 0) {
        await User.findByIdAndUpdate(issue.user, { $inc: { lateFees: fee } });
      }

      return res.json({ message: "Digital book returned successfully", issue, lateFee: fee });
    }

    // PHYSICAL BOOK → admin must confirm physical return
    issue.status = "return_requested";
    await issue.save();

    return res.json({
      message: "Return request submitted. Please return the book physically to the library.",
      issue,
    });
  } catch (error) {
    console.error("returnBook error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= ADMIN: CONFIRM PHYSICAL RETURN =================
exports.confirmReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id).populate("book");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.status !== "return_requested") {
      return res.status(400).json({ message: "No return request pending for this issue" });
    }

    // Increase book availability
    issue.book.availableCopies += 1;
    await issue.book.save();

    const returnDate = new Date();

    // ✅ Calculate late fee
    const fee = calculateLateFee(issue.dueDate, returnDate);
    issue.lateFee = fee;
    issue.status = "returned";
    issue.returnDate = returnDate;
    await issue.save();

    // Update user's total lateFees in User model
    if (fee > 0) {
      await User.findByIdAndUpdate(issue.user, { $inc: { lateFees: fee } });
    }

    res.json({
      message: "Physical return confirmed",
      issue,
      lateFee: fee,
      lateFeeMessage: fee > 0 ? `Late fee of ₹${fee} has been added to user's account` : "Returned on time!",
    });
  } catch (error) {
    console.error("confirmReturn error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= ADMIN: GET ALL REQUESTS =================
exports.getAllRequests = async (req, res) => {
  try {
    // Optional: filter by status via query param e.g. ?status=requested
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const requests = await Issue.find(filter)
      .populate("user", "username email lateFees hasCard") // ✅ FIX: username not name
      .populate("book", "title author type availableCopies")
      .sort({ createdAt: -1 }); // newest first

    res.json(requests);
  } catch (error) {
    console.error("getAllRequests error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= USER: GET MY ISSUES =================
exports.getMyIssues = async (req, res) => {
  try {
    // Optional: filter by status via query param e.g. ?status=approved
    const filter = { user: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const issues = await Issue.find(filter)
      .populate("book", "title author category type availableCopies coverImage")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("getMyIssues error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= ADMIN: GET DASHBOARD STATS =================
exports.getDashboardStats = async (req, res) => {
  try {
    const Book = require("../models/Book");
    const User = require("../models/User");

    const [
      totalBooks,
      totalUsers,
      totalIssued,
      pendingRequests,
      returnRequests,
      usersWithLateFees,
      usersWithCard,
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "user" }),
      Issue.countDocuments({ status: "approved" }),
      Issue.countDocuments({ status: "requested" }),
      Issue.countDocuments({ status: "return_requested" }),
      User.countDocuments({ lateFees: { $gt: 0 } }),
      User.countDocuments({ hasCard: true }),
    ]);

    res.json({
      totalBooks,
      totalUsers,
      totalIssued,
      pendingRequests,
      returnRequests,
      usersWithLateFees,
      usersWithCard,
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= HELPER: LATE FEE CALCULATOR =================
const calculateLateFee = (dueDate, returnDate) => {
  if (!dueDate || !returnDate) return 0;

  const due = new Date(dueDate);
  const returned = new Date(returnDate);

  if (returned <= due) return 0; // Returned on time

  const diffMs = returned - due;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // Round up partial days
  return diffDays * LATE_FEE_PER_DAY;
};


// const Issue = require("../models/Issue");
// const Book = require("../models/Book");

// // ================= USER REQUEST BOOK =================
// exports.requestBook = async (req, res) => {
//   try {
//     const { bookId } = req.body;

//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     if (book.availableCopies <= 0) {
//       return res.status(400).json({ message: "No copies available" });
//     }

//     const issue = await Issue.create({
//       user: req.user._id,
//       book: bookId,
//       status: "requested",
//     });

//     res.status(201).json({ message: "Book request submitted", issue });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ================= ADMIN APPROVES =================
// exports.approveRequest = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const issue = await Issue.findById(id).populate("book");
//     if (!issue) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     if (issue.status !== "requested") {
//       return res.status(400).json({ message: "Request already processed" });
//     }

//     const book = issue.book;

//     if (book.availableCopies <= 0) {
//       return res.status(400).json({ message: "No copies available" });
//     }

//     book.availableCopies -= 1;
//     await book.save();

//     const issueDate = new Date();
//     const dueDate = new Date();
//     dueDate.setDate(issueDate.getDate() + 14);

//     issue.status = "approved";
//     issue.issueDate = issueDate;
//     issue.dueDate = dueDate;

//     await issue.save();

//     res.json({ message: "Request approved", issue });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ================= USER RETURN =================
// // exports.returnBook = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const issue = await Issue.findById(id).populate("book");

// //     if (!issue) {
// //       return res.status(404).json({ message: "Issue record not found" });
// //     }

// //     if (issue.status !== "approved") {
// //       return res.status(400).json({ message: "Invalid return action" });
// //     }

// //     const bookType = issue.book?.type || "physical";

// //     console.log("BOOK TYPE:", bookType);
// //     console.log("BEFORE STATUS:", issue.status);

// //     if (bookType === "digital") {
// //       issue.status = "returned";
// //       issue.returnDate = new Date();
// //       await issue.save();

// //       console.log("UPDATED STATUS:", issue.status);

// //       return res.json({ message: "Digital book returned", issue });
// //     }

// //     // Default → physical
// //     issue.status = "return_requested";
// //     await issue.save();

// //     console.log("UPDATED STATUS:", issue.status);

// //     return res.json({
// //       message: "Return request submitted.",
// //       issue,
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };
// exports.returnBook = async (req, res) => {
//   try {
//     console.log("🔥 RETURN BOOK CONTROLLER HIT 🔥");

//     const { id } = req.params;

//     const issue = await Issue.findById(id).populate("book");

//     if (!issue) {
//       return res.status(404).json({ message: "Issue record not found" });
//     }

//     if (issue.status !== "approved") {
//       return res.status(400).json({ message: "Invalid return action" });
//     }

//     console.log("BOOK TYPE:", issue.book.type);

//     // DIGITAL BOOK
//     if (issue.book.type === "digital") {
//       issue.status = "returned";
//       issue.returnDate = new Date();
//       await issue.save();

//       return res.json({ message: "Digital book returned", issue });
//     }

//     // PHYSICAL BOOK
//     issue.status = "return_requested";
//     await issue.save();

//     return res.json({
//       message: "Return request submitted. Please return physically.",
//       issue,
//     });

//   } catch (error) {
//     console.error("RETURN ERROR:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ================= ADMIN CONFIRM RETURN =================
// exports.confirmReturn = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const issue = await Issue.findById(id).populate("book");

//     if (!issue) {
//       return res.status(404).json({ message: "Issue not found" });
//     }

//     if (issue.status !== "return_requested") {
//       return res.status(400).json({ message: "No return request found" });
//     }

//     issue.book.availableCopies += 1;
//     await issue.book.save();

//     issue.status = "returned";
//     issue.returnDate = new Date();

//     await issue.save();

//     res.json({
//       message: "Physical return confirmed successfully",
//       issue,
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ================= ADMIN GET ALL =================
// exports.getAllRequests = async (req, res) => {
//   try {
//     const requests = await Issue.find()
//       .populate("user", "name email")
//       .populate("book");

//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ================= USER GET OWN =================
// exports.getMyIssues = async (req, res) => {
//   try {
//     const issues = await Issue.find({ user: req.user._id })
//       .populate("book");

//     res.json(issues);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
