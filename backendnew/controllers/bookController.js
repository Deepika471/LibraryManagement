const Book = require("../models/Book");

// 📚 Add Book (Admin Only)
exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      totalCopies,
      type,
      pdfUrl,
      sourceLink,
    } = req.body;

    const book = await Book.create({
      title,
      author,
      category,
      totalCopies,
      availableCopies: totalCopies,
      type: type || "physical",
      pdfUrl: pdfUrl || "",
      sourceLink: sourceLink || "",
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });

  } catch (error) {
    console.error("ADD BOOK ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 📖 Get All Books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✏ Update Book (Admin Only)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      updatedBook,
    });

  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ❌ Delete Book (Admin Only)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
