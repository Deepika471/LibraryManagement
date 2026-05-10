const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    issueDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "return_requested", "returned"],
      default: "requested",
    },
    // Late fee in rupees (₹5 per day after dueDate)
    lateFee: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);


// //Issue.js
// const mongoose = require("mongoose");

// const issueSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     book: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Book",
//       required: true,
//     },
//     issueDate: {
//       type: Date,
//     },
//     dueDate: {
//       type: Date,
//     },
//     returnDate: {
//       type: Date,
//     },
//     status: {
//       type: String,
//       enum: ["requested", "approved", "return_requested", "returned"],
//       default: "requested",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Issue", issueSchema);
