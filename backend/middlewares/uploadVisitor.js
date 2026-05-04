const multer = require("multer");

const storage = multer.memoryStorage(); // ✅ IMPORTANT

const uploadVisitor = multer({ storage });

module.exports = uploadVisitor;