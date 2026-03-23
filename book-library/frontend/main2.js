const API = "http://localhost:3000/api/books";
const list = document.getElementById("book-list");
const form = document.getElementById("book-form");

async function loadBooks() {
  const res = await fetch(API);
  const books = await res.json();
  list.innerHTML = books
    .map(
      (b) => `
      <div class="book-card">
        <img src="${b.image}" alt="${b.title}">
        <h3>${b.title}</h3>
        <p><strong>Author:</strong> ${b.author}</p>
        <p>${b.description || ""}</p>
        <p class="status ${b.available ? "available" : "borrowed"}">
          ${b.available ? "✅ Available" : "❌ Borrowed"}
        </p>
        <div class="buttons">
          <button onclick="toggleBook(${b.id}, ${b.available})">
            ${b.available ? "Borrow" : "Return"}
          </button>
          <button onclick="deleteBook(${b.id})" class="delete-btn">🗑 Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

async function toggleBook(id, available) {
  const action = available ? "borrow" : "return";
  await fetch(`${API}/${id}/${action}`, { method: "PATCH" });
  loadBooks();
}

async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadBooks();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const description = document.getElementById("description").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!title || !author) return alert("Title and author are required.");

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, description, image }),
  });

  form.reset();
  loadBooks();
});

loadBooks();
