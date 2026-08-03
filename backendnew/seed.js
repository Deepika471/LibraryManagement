// seed.js
const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Book = require("./models/Book"); // adjust path if needed
require("dotenv").config();

const CSV_PATH = "./books.csv"; // your downloaded CSV file
const LIMIT = 300; // how many books to seed — change as you like

// Book Depository stores authors/categories as stringified lists like:
// "['J.K. Rowling']" or "['Fiction', 'Fantasy']"
// This safely extracts the first readable value from that format.
function parseListField(value) {
  if (!value) return "";
  try {
    const cleaned = value
      .replace(/[\[\]']/g, "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    return cleaned[0] || "";
  } catch {
    return value;
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const books = [];
  let count = 0;

  const stream = fs
    .createReadStream(CSV_PATH)
    .pipe(csv())
    .on("data", (row) => {
      if (count >= LIMIT) {
        stream.destroy(); // stop reading once we hit the limit
        return;
      }

      const title = row["title"]?.trim();
      const author = parseListField(row["authors"]);
      const category = parseListField(row["categories"]);

      // Skip rows missing required fields
      if (!title || !author || !category) return;

      books.push({
        title,
        author,
        category,
        totalCopies: 5,
        availableCopies: 5,
        type: "physical",
        pdfUrl: "",
        sourceLink: row["url"] || "",
      });

      count++;
    })
    .on("close", async () => {
      try {
        await Book.insertMany(books);
        console.log(`Inserted ${books.length} books successfully`);
      } catch (err) {
        console.error("Insert failed:", err);
      } finally {
        mongoose.connection.close();
      }
    });
}

seed();