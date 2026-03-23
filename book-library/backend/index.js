import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3000;
const DATA_FILE = "./books.json";

app.use(cors());
app.use(express.json());

// ✅ Helper functions
function readBooks() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function saveBooks(books) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

// ✅ Get all books
app.get("/api/books", (req, res) => {
  const books = readBooks();
  res.json(books);
});

// ✅ Add a new book
app.post("/api/books", (req, res) => {
  const { title, author, image, description } = req.body;
  if (!title || !author)
    return res.status(400).json({ error: "Missing title or author" });

  const books = readBooks();
  const newBook = {
    id: books.length ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    description: description || "No description provided",
    image:
      image ||
      "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",
    available: true,
  };
  books.push(newBook);
  saveBooks(books);
  res.status(201).json(newBook);
});

// ✅ Borrow
app.patch("/api/books/:id/borrow", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Not found" });

  book.available = false;
  saveBooks(books);
  res.json(book);
});

// ✅ Return
app.patch("/api/books/:id/return", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id == req.params.id);
  if (!book) return res.status(404).json({ error: "Not found" });

  book.available = true;
  saveBooks(books);
  res.json(book);
});

// 🆕 ✅ DELETE endpoint
app.delete("/api/books/:id", (req, res) => {
  let books = readBooks();
  const bookIndex = books.findIndex((b) => b.id == req.params.id);

  if (bookIndex === -1)
    return res.status(404).json({ error: "Book not found" });

  const removedBook = books.splice(bookIndex, 1)[0];
  saveBooks(books);
  res.json({ message: "Book deleted successfully", book: removedBook });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
