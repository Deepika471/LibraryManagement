const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalCopies: {
      type: Number,
      required: true,
    },
    availableCopies: {
      type: Number,
      required: true,
    },

    // 🔥 New Field: Book Type
    type: {
      type: String,
      enum: ["digital", "physical"],
      required: true,
      default: "physical",
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    sourceLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
