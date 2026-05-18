const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth",   require("./routes/authRoutes"));
app.use("/api/books",  require("./routes/bookRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/admin",  require("./routes/UserRoutes")); 

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Library Management System API Running ✅");
});

// ================= DATABASE CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // ✅ Start server ONLY after DB connects (important!)
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Stop server if DB fails
  });

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// console.log("🚀 SERVER FILE LOADED FROM:", __dirname);

// // ================= MIDDLEWARE =================
// app.use(cors());
// app.use(express.json());

// // ================= ROUTES =================
// const authRoutes = require("./routes/authRoutes");

// app.use("/api/auth", authRoutes);
// // app.post("/api/auth/register", (req, res) => {
// //   res.json({ message: "Direct route works" });
// // });

// const bookRoutes = require("./routes/bookRoutes");
// app.use("/api/books", bookRoutes);

// const issueRoutes = require("./routes/issueRoutes");
// app.use("/api/issues", issueRoutes);


// // Test Route
// app.get("/", (req, res) => {
//   res.send("Library Management System API Running");
// });

// // ================= DATABASE CONNECTION =================
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.log("❌ MongoDB Error:", err));

// // ================= SERVER START =================
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// console.log("Running from backendnew folder");
// app.post("/test", (req, res) => {
//   res.json({ message: "Test route works" });
// });

// // ================= AUTHENTICATION =================
// const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");

// app.get("/protected", verifyToken, (req, res) => {
//   res.json({ message: "You accessed protected route", user: req.user });
// });

// app.get("/admin-only", verifyAdmin, (req, res) => {
//   res.json({ message: "Welcome Admin 👑" });
// });



